import { Button, Heading, Section, Text } from '@react-email/components';
import { COLORS, FONT, Shell } from './_shared';

/**
 * Internal mail to the band leader: 'Soll ich nachhaken bei {venue}?'
 * Sent 7 days after an outreach without reply.
 */
interface Props {
  leaderName: string;
  venueName: string;
  daysSilent: number;
  reviewUrl: string;
}

export function FollowUpReminder({ leaderName, venueName, daysSilent, reviewUrl }: Props) {
  return (
    <Shell preview={`Soll ich bei ${venueName} nachhaken?`}>
      <Heading
        style={{
          fontFamily: FONT.serif,
          fontWeight: 400,
          fontSize: 26,
          letterSpacing: '-0.02em',
          color: COLORS.text,
          margin: '0 0 12px',
        }}
      >
        Soll ich bei {venueName} nachhaken?
      </Heading>
      <Text style={{ color: COLORS.text2, fontSize: 15, lineHeight: 1.6, margin: '0 0 16px' }}>
        Hi {leaderName},
      </Text>
      <Text style={{ color: COLORS.text2, fontSize: 15, lineHeight: 1.6, margin: '0 0 16px' }}>
        Seit {daysSilent} Tagen keine Antwort. Ich hab einen Follow-up-Draft fertig — sanft,
        höflich, freundliche Erinnerung. Schau drüber, dann geht er raus.
      </Text>
      <Section>
        <Button
          href={reviewUrl}
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
          Follow-up ansehen
        </Button>
      </Section>
    </Shell>
  );
}

export default FollowUpReminder;
