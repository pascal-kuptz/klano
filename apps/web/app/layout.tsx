import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://app.klano.ai'),
  title: {
    default: 'Klano',
    template: '%s · Klano',
  },
  description: 'Klano — der Booking-Agent für Bands.',
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: '#FAFAFA',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
