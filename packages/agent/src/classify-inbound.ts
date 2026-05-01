import { generateObject } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';
import { DEFAULT_MODEL } from './draft-outreach';

export const ClassificationSchema = z.object({
  intent: z.enum(['positive', 'negative', 'question', 'spam', 'other']),
  suggestedNextAction: z.enum(['wait', 'reply', 'archive', 'confirm']),
  extractedDate: z
    .string()
    .nullable()
    .describe('ISO date if a specific gig date was offered, else null'),
  extractedFee: z
    .number()
    .nullable()
    .describe('Numeric fee in CHF/EUR/USD if mentioned, else null'),
  summary: z.string().describe('One sentence summary of the reply, max 120 chars'),
});

export type Classification = z.infer<typeof ClassificationSchema>;

const SYSTEM = `Du bist ein Klassifikator für Booking-Mails einer Band.
Lies die Mail und entscheide:
- intent: positive/negative/question/spam/other
- suggestedNextAction: wait/reply/archive/confirm
- extractedDate: ein konkretes Gig-Datum (ISO YYYY-MM-DD), wenn genannt — sonst null
- extractedFee: eine Gage als Zahl (CHF/EUR/USD), wenn genannt — sonst null
- summary: ein Satz, max 120 Zeichen, sachlich, deutsch

Sei konservativ: 'positive' nur bei klarem Ja/Termin/Gage. 'question' wenn das
Venue nachfragt (Specs, Demos). 'negative' bei Absage. 'spam' bei Auto-Reply
oder Werbung. Sonst 'other'.

confirm = positive Antwort die der Band-Leader bestätigen muss.
reply = Venue stellt Fragen die wir beantworten müssen.
wait = neutral, keine Aktion nötig.
archive = Absage / Spam.`;

export interface ClassifyInput {
  emailBody: string;
  subject?: string;
  threadContext?: string;
}

export async function classifyInboundEmail(input: ClassifyInput): Promise<Classification> {
  const modelId = process.env.KLANO_LLM_MODEL ?? DEFAULT_MODEL;
  const prompt = [
    input.threadContext ? `Vorheriger Thread:\n${input.threadContext}\n\n---\n\n` : '',
    input.subject ? `Betreff: ${input.subject}\n\n` : '',
    `Mail-Body:\n${input.emailBody}`,
  ].join('');

  const { object } = await generateObject({
    model: anthropic(modelId),
    schema: ClassificationSchema,
    system: SYSTEM,
    prompt,
    temperature: 0.1,
  });
  return object;
}
