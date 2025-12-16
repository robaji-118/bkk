import type { Metadata } from 'next';
import './globals.css';
import '@/styles/index.scss';

export const metadata: Metadata = {
  title: 'BKK',
  description: 'Your body deserves maintenance, not just emergency repairs.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
