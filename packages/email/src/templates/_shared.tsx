import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import type { ReactNode } from 'react';

export const COLORS = {
  canvas: '#fafafa',
  surface: '#ffffff',
  border: '#e4e4e7',
  text: '#0a0a0a',
  text2: '#52525b',
  text3: '#a1a1aa',
  action: '#0a0a0a',
  actionFg: '#ffffff',
};

export const FONT = {
  sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, Roboto, sans-serif',
  serif: '"Instrument Serif", Georgia, serif',
  mono: 'ui-monospace, SFMono-Regular, "Geist Mono", Menlo, monospace',
};

interface ShellProps {
  preview: string;
  children: ReactNode;
}

export function Shell({ preview, children }: ShellProps) {
  return (
    <Html lang="de">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={{ background: COLORS.canvas, margin: 0, padding: '32px 16px', fontFamily: FONT.sans }}>
        <Container
          style={{
            background: COLORS.surface,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 16,
            maxWidth: 560,
            margin: '0 auto',
            padding: '32px 28px',
          }}
        >
          <Section>
            <Text
              style={{
                fontFamily: FONT.serif,
                fontSize: 22,
                fontWeight: 400,
                letterSpacing: '-0.02em',
                color: COLORS.text,
                margin: 0,
                lineHeight: 1,
              }}
            >
              klano
            </Text>
          </Section>
          <Hr style={{ borderColor: COLORS.border, margin: '24px 0' }} />
          {children}
          <Hr style={{ borderColor: COLORS.border, margin: '32px 0 16px' }} />
          <Section>
            <Text
              style={{
                fontFamily: FONT.mono,
                fontSize: 11,
                color: COLORS.text3,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                margin: 0,
              }}
            >
              klano.ai · Zürich
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
