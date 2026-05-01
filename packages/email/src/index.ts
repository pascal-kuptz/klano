// Resend client + React Email templates. Used by apps/web API routes
// for transactional + outreach mail. See _source/build-plan-v0.md §7.

export {
  sendMail,
  isMailReady,
  FROM_DEFAULT,
  type SendArgs,
  type SendResult,
} from './client';

export { WelcomeEmail } from './templates/WelcomeEmail';
export { BandInvitationEmail } from './templates/BandInvitationEmail';
export { OutreachEmail } from './templates/OutreachEmail';
export { FollowUpReminder } from './templates/FollowUpReminder';

export const INBOUND_DOMAIN = 'inbound.klano.ai';

/** Build the per-booking reply-to address for inbound parsing. */
export function buildReplyTo(bandId: string, bookingId: string): string {
  return `band-${bandId}-booking-${bookingId}@${INBOUND_DOMAIN}`;
}

/** Parse the band/booking ids back out of an inbound reply-to address. */
export function parseReplyTo(addr: string): { bandId: string; bookingId: string } | null {
  const match = /band-([0-9a-f-]{8,})-booking-([0-9a-f-]{8,})@/i.exec(addr);
  if (!match) return null;
  return { bandId: match[1]!, bookingId: match[2]! };
}
