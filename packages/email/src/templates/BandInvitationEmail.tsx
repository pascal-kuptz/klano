import { Button, Heading, Section, Text } from '@react-email/components';
import { COLORS, FONT, Shell } from './_shared';

interface Props {
  bandName: string;
  invitedByName: string;
  acceptUrl: string;
}

export function BandInvitationEmail({ bandName, invitedByName, acceptUrl }: Props) {
  return (
    <Shell preview={`${invitedByName} hat dich zu ${bandName} eingeladen.`}>
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
        Du bist Teil von {bandName}.
      </Heading>
      <Text style={{ color: COLORS.text2, fontSize: 15, lineHeight: 1.6, margin: '0 0 16px' }}>
        {invitedByName} hat dich zu {bandName} auf Klano hinzugefügt — der digitale Bandkollege,
        der den Orga-Job übernimmt.
      </Text>
      <Text style={{ color: COLORS.text2, fontSize: 15, lineHeight: 1.6, margin: '0 0 24px' }}>
        Akzeptier die Einladung — dauert 30 Sekunden, kein Passwort nötig.
      </Text>
      <Section style={{ marginBottom: 24 }}>
        <Button
          href={acceptUrl}
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
          Einladung annehmen
        </Button>
      </Section>
      <Text style={{ color: COLORS.text3, fontSize: 12, lineHeight: 1.6, margin: 0 }}>
        Der Link ist 14 Tage gültig. Falls die Mail unerwartet kam, ignoriere sie einfach.
      </Text>
    </Shell>
  );
}

export default BandInvitationEmail;
