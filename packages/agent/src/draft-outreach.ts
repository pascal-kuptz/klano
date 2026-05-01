import { streamText, type StreamTextResult, type ToolSet } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import {
  OUTREACH_SYSTEM_DE,
  OUTREACH_SYSTEM_EN,
  buildOutreachUserPrompt,
  type OutreachInput,
} from './prompts/outreach';

/** Default model id. Override via KLANO_LLM_MODEL env. */
export const DEFAULT_MODEL = 'claude-sonnet-4-5';

export interface StreamDraftResult {
  /** Vercel AI SDK stream — toDataStreamResponse() gives a Next-friendly Response. */
  stream: StreamTextResult<ToolSet, never>;
  modelId: string;
  promptVersion: string;
}

/**
 * Streams an outreach mail draft from Anthropic Claude. Caller decides how to
 * pipe the stream to the client (e.g. `result.toDataStreamResponse()` in a
 * Next.js route).
 *
 * Throws if ANTHROPIC_API_KEY is not configured. Wrap with isAgentReady()
 * upstream to fall back to a deterministic template.
 */
export function streamOutreachDraft(input: OutreachInput): StreamDraftResult {
  const lang = input.venue.primaryLanguage ?? 'de';
  const system = lang === 'de' ? OUTREACH_SYSTEM_DE : OUTREACH_SYSTEM_EN;
  const userPrompt = buildOutreachUserPrompt(input);

  const modelId = process.env.KLANO_LLM_MODEL ?? DEFAULT_MODEL;

  const stream = streamText({
    model: anthropic(modelId),
    system,
    prompt: userPrompt,
    maxTokens: 700,
    temperature: 0.5,
  });

  return {
    stream,
    modelId,
    promptVersion: '2026-05-01.1',
  };
}

export function isAgentReady(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}
