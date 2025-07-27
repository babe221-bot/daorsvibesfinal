import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'DaorsVibes',
  description: 'Vaš ultimativni muzički pratilac za tekstove, akorde i setliste.',
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
          autoPlay
          loop
          muted
          playsInline
          className="video-background"
          poster="https://placehold.co/1920x1080/000000/000000.png"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-abstract-video-of-a-man-with-a-special-effect-4328-large.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="relative z-0 bg-background/70 min-h-svh">
            {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
