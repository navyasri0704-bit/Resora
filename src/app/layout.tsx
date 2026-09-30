import type { Metadata } from 'next';
import './globals.css';
import { ResoraProvider } from '@/context/ResoraContext';

export const metadata: Metadata = {
  title: 'RESORA - Smart Campus Resource Network',
  description: 'Discover. Book. Access. Grow. One intelligent campus platform for resources, learning, opportunities and student growth.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-slate-50 text-slate-900 font-sans antialiased min-h-screen flex flex-col">
        <ResoraProvider>
          <div className="flex-1 flex flex-col">{children}</div>
        </ResoraProvider>
      </body>
    </html>
  );
}
