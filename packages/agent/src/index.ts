// AI Agent — Vercel AI SDK + Claude (Sonnet default).
// Tools: streamOutreachDraft (v0.5). classifyInboundEmail, scheduleFollowUp,
// proposeRehearsal land in v0.6+. See _source/build-plan-v0.md §6.

export {
  streamOutreachDraft,
  isAgentReady,
  DEFAULT_MODEL,
  type StreamDraftResult,
} from './draft-outreach';

export { buildFallbackDraft } from './template-fallback';

export {
  OUTREACH_PROMPT_VERSION,
  OUTREACH_SYSTEM_DE,
  OUTREACH_SYSTEM_EN,
  buildOutreachUserPrompt,
  type OutreachInput,
} from './prompts/outreach';
