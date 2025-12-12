
'use client';

import { Button } from '@/components/ui/button';
import { Check, Home, Share2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function OrderConfirmedPage() {
  const router = useRouter();

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'I just placed an order!',
        text: 'Check out this awesome store!',
        url: window.location.origin,
      }).catch(console.error);
    } else {
      // Fallback for browsers that don't support the Web Share API
      alert("Sharing is not supported on your browser, but you can copy the link: " + window.location.origin);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-500 text-white p-4">
      <div className="absolute top-4 left-4">
        <Button variant="ghost" size="icon" onClick={() => router.push('/')}>
          <Home className="h-6 w-6" />
        </Button>
      </div>
      <div className="text-center flex flex-col items-center">
        <div className="bg-white rounded-full p-4 mb-8">
          <Check className="h-16 w-16 text-blue-500" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Order Confirmed</h1>
        <p className="max-w-sm mb-2">
          Thank you for your order. You will receive an email confirmation shortly.
        </p>
        <p className="max-w-sm mb-8">
          Check the status of your order on the{' '}
          <Link href="/account" className="font-bold underline">
            Order tracking page
          </Link>
        </p>
        <div className="space-y-4 w-full max-w-xs">
          <Button
            asChild
            className="w-full bg-white text-blue-500 hover:bg-gray-100"
            size="lg"
          >
            <Link href="/">Continue Shopping</Link>
          </Button>
          <Button
            variant="outline"
            className="w-full border-white text-white hover:bg-white hover:text-blue-500"
            size="lg"
            onClick={handleShare}
          >
            <Share2 className="mr-2 h-5 w-5" /> Share
          </Button>
        </div>
      </div>
    </div>
  );
}
