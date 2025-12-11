
'use client';

import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/contexts/cart-context';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import CartSheet from '@/components/cart/cart-sheet';
import { FirebaseClientProvider, useFirestore } from '@/firebase';
import { seedInitialData } from '@/lib/bootstrap-db';
import { useEffect, useState } from 'react';

const metadata: Metadata = {
  title: 'AnimEcom',
  description: 'A modern e-commerce experience with stunning animations.',
  icons: {
    icon: '/favicon.ico',
  },
};

function DatabaseSeeder({
  setSeedingComplete,
}: {
  setSeedingComplete: (complete: boolean) => void;
}) {
  const firestore = useFirestore();

  useEffect(() => {
    async function seedData() {
      if (firestore) {
        await seedInitialData(firestore);
        setSeedingComplete(true);
      }
    }
    seedData();
  }, [firestore, setSeedingComplete]);

  return (
    <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-lg font-semibold">Preparing your experience...</p>
        <p className="text-muted-foreground">This will only take a moment.</p>
      </div>
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSeedingComplete, setSeedingComplete] = useState(false);
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Space+Grotesk:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <FirebaseClientProvider>
          <CartProvider>
            {!isSeedingComplete && (
              <DatabaseSeeder setSeedingComplete={setSeedingComplete} />
            )}
            <div className={`flex flex-col min-h-dvh ${isSeedingComplete ? 'opacity-100' : 'opacity-0'}`}>
              <Header />
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
            <CartSheet />
            <Toaster />
          </CartProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
