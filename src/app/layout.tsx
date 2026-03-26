import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase/client-provider';

export const metadata: Metadata = {
  title: {
    default: 'Elderly Solutions Germany',
    template: '%s | Elderly Solutions Germany',
  },
  description: 'Compassionate care, connected. Seamless health monitoring, community engagement, and AI-powered assistance for elderly care in Germany.',
  icons: {
    icon: '/favicon.ico', // Make sure to have a favicon in your public folder
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
   openGraph: {
    title: 'Elderly Solutions Germany',
    description: 'Compassionate care, connected.',
    url: 'https://your-app-url.com', // Replace with your actual URL
    siteName: 'Elderly Solutions Germany',
    images: [
      {
        url: 'https://your-app-url.com/og-image.png', // Replace with your actual OG image URL
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Elderly Solutions Germany',
    description: 'Compassionate care, connected.',
    // creator: '@your_twitter_handle', // Replace with your Twitter handle
    images: ['https://your-app-url.com/og-image.png'], // Replace with your actual OG image URL
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Alegreya:wght@700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <FirebaseClientProvider>
          {children}
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
