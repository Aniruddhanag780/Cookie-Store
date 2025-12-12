
'use client';
import { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  CreditCard,
  Gift,
  IndianRupee,
  Landmark,
  Wallet,
  ShieldCheck,
  Calendar,
  Smile,
  HelpCircle,
} from 'lucide-react';
import { useCart } from '@/contexts/cart-context';
import { formatCurrency } from '@/lib/utils';
import { useFirestore, useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

const UpiIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.886 8.169L4.97 9.808a.502.502 0 0 0 .343.866h1.228a.5.5 0 0 1 .494.42l.534 3.166a.5.5 0 0 1-.494.58h-1.29a.5.5 0 0 0-.494.42l-.534 3.166a.5.5 0 0 0 .494.58h1.29a.5.5 0 0 0 .494-.42l.534-3.166a.5.5 0 0 1 .494-.58h.42a.5.5 0 0 1 .493.58L9.04 22.58a.5.5 0 0 0 .494.42h1.637a.5.5 0 0 0 .494-.42L13.19 10.97a.5.5 0 0 0-.494-.58h-1.29a.5.5 0 0 0-.494.42l-.534 3.165a.5.5 0 0 1-.494.58h-.42a.5.5 0 0 1-.494-.58l.534-3.165a.5.5 0 0 0-.494-.58H8.468a.5.5 0 0 0-.494.42L7.44 16.82a.5.5 0 0 1-.494.58H5.718a.5.5 0 0 1-.494-.42l.534-3.165a.5.5 0 0 0-.494-.58H3.84a.5.5 0 0 1-.353-.858L9.03 6.13a.5.5 0 0 1 .708 0l2.09 2.09-.586.586a.5.5 0 0 1-.707 0L9.03 7.299l-5.116 5.115H5.14a.5.5 0 0 1 .494.42l-.534 3.165h.92l.494-2.617h.42l-.534 3.165h.348l-.534-3.165zM17.114 8.169l1.916 1.639a.502.502 0 0 1-.343.866h-1.228a.5.5 0 0 0-.494.42l-.534 3.166a.5.5 0 0 0 .494.58h1.29a.5.5 0 0 1 .494.42l.534 3.166a.5.5 0 0 1-.494.58h-1.29a.5.5 0 0 1-.494-.42l-.534-3.166a.5.5 0 0 0-.494-.58h-.42a.5.5 0 0 0-.493.58l.534 3.166a.5.5 0 0 1-.494.42h-1.637a.5.5 0 0 1-.494-.42L8.81 10.97a.5.5 0 0 1 .494-.58h1.29a.5.5 0 0 1 .494.42l.534 3.165a.5.5 0 0 0 .494.58h.42a.5.5 0 0 0 .494-.58l-.534-3.165a.5.5 0 0 1 .494-.58h1.228a.5.5 0 0 1 .494-.42l.534-3.165a.5.5 0 0 0 .494-.58h-1.228a.5.5 0 0 1-.494-.42L14.97 1.42A.5.5 0 0 1 15.464 1h1.637a.5.5 0 0 1 .494.42l.534 3.165a.5.5 0 0 0 .494.58h1.228a.5.5 0 0 0 .353-.858L14.97 2.13a.5.5 0 0 0-.708 0l-2.09 2.09.586.586a.5.5 0 0 0 .707 0l1.507-1.507.282 1.507z"
      fill="#404040"
    />
  </svg>
);

type ShippingDetails = {
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    zipCode: string;
    country: string;
  };
  billingAddress: {
    fullName?: string;
    address?: string;
    city?: string;
    zipCode?: string;
    country?: string;
  };
};

export default function PaymentPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails | null>(
    null
  );
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const details = sessionStorage.getItem('shippingDetails');
    if (details) {
      setShippingDetails(JSON.parse(details));
    } else {
      router.push('/checkout');
    }
  }, [router]);

  const deliveryFee = cartTotal > 0 ? 15 : 0;
  const discount = cartTotal > 100 ? cartTotal * 0.2 : 0; // e.g. 20% discount
  const totalAmount = cartTotal - discount + deliveryFee;

  const handlePayment = async (paymentMethod: string) => {
    if (!firestore || !user || !shippingDetails) {
      toast({
        title: 'Error',
        description:
          'You must be logged in and have shipping details to place an order.',
        variant: 'destructive',
      });
      if (!user) router.push('/login');
      if (!shippingDetails) router.push('/checkout');
      return;
    }

    try {
      const ordersCollection = collection(firestore, 'orders');
      await addDoc(ordersCollection, {
        userId: user.uid,
        userEmail: user.email,
        date: serverTimestamp(),
        status: 'Processing',
        total: totalAmount,
        paymentMethod,
        ...shippingDetails,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          slug: item.slug,
          description: item.description,
          longDescription: item.longDescription,
          price: item.price,
          category: item.category,
          image: item.image,
          imageHint: item.imageHint,
          quantity: item.quantity,
        })),
      });

      clearCart();
      sessionStorage.removeItem('shippingDetails');
      router.push('/order-confirmed');
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: 'Order Failed',
        description:
          'There was a problem placing your order. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (!shippingDetails) {
    return <div className="container mx-auto text-center py-12">Loading...</div>;
  }

  return (
    <div className="bg-blue-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-2xl">
        <header className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground bg-white px-3 py-1 rounded-full border">
            <ShieldCheck className="h-4 w-4 text-green-500" />
            <span>100% Secure</span>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-white p-4 rounded-lg border mb-6">
          <div>
            <p className="text-muted-foreground text-sm">Amount Payable</p>
            <p className="text-2xl font-bold">{formatCurrency(totalAmount)}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold">{cart.length} items in cart</p>
          </div>
        </div>

        <div className="bg-green-100 border border-green-300 text-green-800 p-3 rounded-lg text-center text-sm mb-6">
          Yay! <strong>5% Instant Cashback</strong> on all UPI & Card payments.
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <h2 className="font-bold text-lg mb-4 uppercase text-gray-500">
            Payment Options
          </h2>
          <Accordion type="single" collapsible className="w-full" defaultValue="credit-card">
            <AccordionItem value="gift-card">
              <AccordionTrigger className="p-4 hover:no-underline font-semibold">
                <div className="flex items-center gap-3">
                  <Gift className="h-5 w-5" /> Have a Gift Card?
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4 pt-0">
                <p className="text-muted-foreground text-sm">
                  Enter your gift card number below.
                </p>
                <div className="flex gap-2 mt-2">
                  <Input placeholder="Gift Card Number" />
                  <Input placeholder="PIN" />
                  <Button>Apply</Button>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="upi">
              <AccordionTrigger className="p-4 hover:no-underline font-semibold">
                <div className="flex items-center gap-3">
                  <UpiIcon /> UPI
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4 pt-0">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Enter your UPI ID
                  </p>
                  <div className="flex gap-2">
                    <Input placeholder="yourupi@bank" />
                    <Button
                      type="button"
                      variant="outline"
                      className="border-primary text-primary"
                      onClick={() => handlePayment('UPI')}
                    >
                      Pay Now
                    </Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="credit-card">
              <AccordionTrigger className="p-4 hover:no-underline font-semibold">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5" /> Credit / Debit / ATM Card
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4 pt-0">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Add and secure cards as per RBI guidelines.
                  </p>
                   <p className="text-sm text-green-600 font-semibold">
                    Get upto 5% cashback • 2 offers available
                  </p>
                  <div className="space-y-2">
                    <Input placeholder="Card Number" />
                    <div className="flex gap-2">
                      <Input placeholder="MM / YY" />
                      <Input placeholder="CVV" />
                    </div>
                  </div>
                  <Button className="w-full" onClick={() => handlePayment('Credit Card')}>
                    Pay {formatCurrency(totalAmount)}
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="cod">
              <AccordionTrigger className="p-4 hover:no-underline font-semibold">
                <div className="flex items-center gap-3">
                  <IndianRupee className="h-5 w-5" /> Cash on Delivery
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4 pt-0">
                <p className="text-sm text-muted-foreground mb-4">
                  Pay with cash upon delivery.
                </p>
                <Button className="w-full" onClick={() => handlePayment('Cash on Delivery')}>
                  Confirm Order
                </Button>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="flex justify-between items-center p-4 border-t">
              <div className="flex items-center gap-3 font-semibold">
                <Calendar className="h-5 w-5" />
                <span>EMI</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Unavailable</span>
                <HelpCircle className="h-4 w-4" />
              </div>
          </div>
        </div>

        <div className="text-center text-muted-foreground mt-8 flex flex-col items-center gap-2">
            <p>35 Crore happy customers and counting!</p>
            <Smile className="h-6 w-6"/>
        </div>
      </div>
    </div>
  );
}
