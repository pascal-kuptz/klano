import { Body, Container, Head, Html, Preview, Text } from '@react-email/components';

/**
 * Outreach mail to a venue. This is a venue-facing email — no Klano branding,
 * no badges, no CTA buttons. Just plain text, like a hand-written band mail.
 *
 * The body is the AI-generated draft (from packages/agent draftOutreach).
 * We render it with simple typography so it looks like a personal note.
 */
interface Props {
  body: string;
  preview?: string;
}

export function OutreachEmail({ body, preview }: Props) {
  return (
    <Html lang="de">
      <Head />
      <Preview>{preview ?? body.slice(0, 90)}</Preview>
      <Body
        style={{
          margin: 0,
          padding: '24px 16px',
          background: '#ffffff',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
        }}
      >
        <Container style={{ maxWidth: 600, margin: '0 auto' }}>
          {body.split('\n\n').map((paragraph, i) => (
            <Text
              key={i}
              style={{
                color: '#111111',
                fontSize: 15,
                lineHeight: 1.6,
                margin: '0 0 14px',
                whiteSpace: 'pre-wrap',
              }}
            >
              {paragraph}
            </Text>
          ))}
        </Container>
      </Body>
    </Html>
  );
}

export default OutreachEmail;
