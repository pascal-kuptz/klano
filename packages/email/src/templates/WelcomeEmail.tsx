import { Button, Heading, Section, Text } from '@react-email/components';
import { COLORS, FONT, Shell } from './_shared';

interface Props {
  firstName?: string;
  appUrl?: string;
}

export function WelcomeEmail({ firstName = 'da', appUrl = 'https://app.klano.ai' }: Props) {
  return (
    <Shell preview={`Hi ${firstName} — willkommen bei Klano.`}>
      <Heading
        style={{
          fontFamily: FONT.serif,
          fontWeight: 400,
          fontSize: 28,
          letterSpacing: '-0.02em',
          color: COLORS.text,
          margin: '0 0 12px',
        }}
      >
        Willkommen bei Klano.
      </Heading>
      <Text style={{ color: COLORS.text2, fontSize: 15, lineHeight: 1.55, margin: '0 0 16px' }}>
        Hi {firstName},
      </Text>
      <Text style={{ color: COLORS.text2, fontSize: 15, lineHeight: 1.6, margin: '0 0 16px' }}>
        Schön dass du dabei bist. Klano übernimmt jetzt das Zähe — Venue-Suche,
        Outreach-Mails, Follow-ups. Du fokussierst aufs Spielen.
      </Text>
      <Text style={{ color: COLORS.text2, fontSize: 15, lineHeight: 1.6, margin: '0 0 24px' }}>
        Ein guter erster Schritt: trag im Dashboard die E-Mails deiner Bandkollegen ein. Wir
        schicken ihnen einen Magic-Link.
      </Text>
      <Section>
        <Button
          href={appUrl}
          style={{
            background: COLORS.action,
            color: COLORS.actionFg,
            padding: '12px 22px',
            borderRadius: 999,
            fontSize: 14,
            fontWeight: 500,
            textDecoration: 'none',
          }}
        >
          Zum Dashboard
        </Button>
      </Section>
    </Shell>
  );
}

export default WelcomeEmail;
