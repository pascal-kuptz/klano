import { Resend } from 'resend';
import { render } from '@react-email/render';
import type { ReactElement } from 'react';

export interface SendArgs {
  /** Single or comma-separated list of recipients */
  to: string | string[];
  subject: string;
  /** Either pre-rendered HTML or a React Email component */
  react?: ReactElement;
  html?: string;
  /** Plaintext fallback */
  text?: string;
  /** Defaults to FROM_DEFAULT (hello@klano.ai) */
  from?: string;
  replyTo?: string | string[];
  /** Headers passed through to Resend (e.g. X-Klano-Booking) */
  headers?: Record<string, string>;
  /** Optional tags for Resend dashboard / filtering */
  tags?: { name: string; value: string }[];
}

export interface SendResult {
  ok: boolean;
  /** Resend message id, or 'dev:<timestamp>' in fallback mode */
  id: string;
  source: 'resend' | 'dev';
  error?: string;
}

export const FROM_DEFAULT = 'Klano <hello@klano.ai>';

let resendInstance: Resend | null = null;
function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!resendInstance) resendInstance = new Resend(process.env.RESEND_API_KEY);
  return resendInstance;
}

export function isMailReady(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

/**
 * Send a transactional or outreach mail. Falls back to a console-log
 * in dev when RESEND_API_KEY is missing — same return shape, source='dev'.
 */
export async function sendMail(args: SendArgs): Promise<SendResult> {
  const html = args.html ?? (args.react ? await render(args.react) : undefined);
  const text = args.text ?? (args.react ? await render(args.react, { plainText: true }) : undefined);
  const from = args.from ?? FROM_DEFAULT;

  const resend = getResend();
  if (!resend) {
    // Dev fallback — no Resend key configured.
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.info('[mail:dev]', {
        to: args.to,
        from,
        subject: args.subject,
        replyTo: args.replyTo,
        textPreview: text?.slice(0, 200),
      });
    }
    return { ok: true, id: `dev:${Date.now()}`, source: 'dev' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from,
      to: Array.isArray(args.to) ? args.to : [args.to],
      subject: args.subject,
      html: html ?? '',
      text: text ?? args.subject,
      replyTo: args.replyTo,
      headers: args.headers,
      tags: args.tags,
    });
    if (error) return { ok: false, id: '', source: 'resend', error: error.message };
    return { ok: true, id: data?.id ?? '', source: 'resend' };
  } catch (e) {
    return {
      ok: false,
      id: '',
      source: 'resend',
      error: e instanceof Error ? e.message : 'unknown',
    };
  }
}
