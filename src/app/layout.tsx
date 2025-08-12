import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'DaorsVibes',
  description: 'Vaš ultimativni muzički pratilac za tekstove, akorde i setliste.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'DaorsVibes',
  },
  icons: {
    icon: [
      { url: '/icons/logo-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/logo-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/icons/logo-128x128.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bs" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("font-body antialiased min-h-screen")}>
        <video
            src="/logo-transformation-video.mp4"
            autoPlay
            loop
            muted
            className="video-background"
        />
        <div className="relative z-0 bg-background/70 min-h-svh">
            {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}