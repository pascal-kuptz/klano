import { NextResponse } from 'next/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import {
  buildFallbackDraft,
  isAgentReady,
  streamOutreachDraft,
  OUTREACH_PROMPT_VERSION,
  type OutreachInput,
} from '@klano/agent';
import { createServerClient, getUser } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface PostBody {
  band: OutreachInput['band'];
  venue: OutreachInput['venue'];
  intent?: OutreachInput['intent'];
  customNote?: string;
}

/**
 * POST /api/agent/draft — streams an outreach mail draft.
 *
 * Behavior:
 *  - With ANTHROPIC_API_KEY set → streams from Claude via Vercel AI SDK
 *  - Without API key → returns a deterministic template as a single chunk so
 *    the client gets the same Response shape (used for local dev pre-setup)
 *
 * Logs the request as an `agent_actions` row when Supabase is configured.
 */
export async function POST(request: Request) {
  let body: PostBody;
  try {
    body = (await request.json()) as PostBody;
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body.band?.name || !body.venue?.name) {
    return NextResponse.json(
      { ok: false, error: 'band.name and venue.name required' },
      { status: 400 },
    );
  }

  const input: OutreachInput = {
    band: body.band,
    venue: body.venue,
    intent: body.intent ?? 'first_contact',
    customNote: body.customNote,
  };

  const start = Date.now();
  const user = await getUser();

  // === LIVE PATH: Anthropic streaming ===
  if (isAgentReady()) {
    try {
      const { stream, modelId } = streamOutreachDraft(input);

      // Fire-and-forget log: usage info attached when stream finishes.
      stream.usage
        .then((u) =>
          logAgentAction({
            user,
            band: input.band,
            input,
            modelId,
            tokensIn: (u as { promptTokens?: number }).promptTokens ?? null,
            tokensOut: (u as { completionTokens?: number }).completionTokens ?? null,
            durationMs: Date.now() - start,
            error: null,
          }),
        )
        .catch(() => {});

      // Returns a Response with text/event-stream — client reads via fetch.
      return stream.toTextStreamResponse({
        headers: {
          'X-Klano-Source': 'anthropic',
          'X-Klano-Model': modelId,
          'X-Klano-Prompt-Version': OUTREACH_PROMPT_VERSION,
        },
      });
    } catch (e) {
      console.error('agent/draft live failed', e);
      // Fall through to template
      const fallback = buildFallbackDraft(input);
      logAgentAction({
        user,
        band: input.band,
        input,
        modelId: 'fallback',
        tokensIn: 0,
        tokensOut: 0,
        durationMs: Date.now() - start,
        error: e instanceof Error ? e.message : 'unknown',
      });
      return new Response(`${fallback.subject}\n\n${fallback.body}`, {
        headers: {
          'content-type': 'text/plain; charset=utf-8',
          'X-Klano-Source': 'fallback-after-error',
        },
      });
    }
  }

  // === FALLBACK PATH: deterministic template, no API key required ===
  const fallback = buildFallbackDraft(input);
  logAgentAction({
    user,
    band: input.band,
    input,
    modelId: 'fallback',
    tokensIn: 0,
    tokensOut: 0,
    durationMs: Date.now() - start,
    error: null,
  });

  return new Response(`${fallback.subject}\n\n${fallback.body}`, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'X-Klano-Source': 'fallback',
      'X-Klano-Prompt-Version': OUTREACH_PROMPT_VERSION,
    },
  });
}

interface LogArgs {
  user: { id: string } | null;
  band: OutreachInput['band'];
  input: OutreachInput;
  modelId: string;
  tokensIn: number | null;
  tokensOut: number | null;
  durationMs: number;
  error: string | null;
}

async function logAgentAction(args: LogArgs) {
  // Skip if Supabase not configured (local dev without env vars).
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;
  try {
    const supabase = (await createServerClient()) as unknown as SupabaseClient;
    await supabase.from('agent_actions').insert({
      band_id: null, // no band id at compose time yet — wired in v0.6 when bookings flow lands
      triggered_by: args.user?.id ?? null,
      action_type: 'draft_outreach',
      input: args.input,
      output: null,
      status: args.error ? 'failed' : 'success',
      error: args.error,
      tokens_input: args.tokensIn,
      tokens_output: args.tokensOut,
    });
  } catch (e) {
    console.warn('agent_actions log skipped', e);
  }
}
