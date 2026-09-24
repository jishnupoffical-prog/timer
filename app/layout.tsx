import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Batch Countdown Timer',
  description: 'Countdown to the next daily batch slot',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}