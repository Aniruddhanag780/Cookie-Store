
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
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails | null>(null);
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const details = sessionStorage.getItem('shippingDetails');
    if (details) {
      setShippingDetails(JSON.parse(details));
    } else {
      // If no shipping details, user shouldn't be here.
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
        description: 'You must be logged in and have shipping details to place an order.',
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
        description: 'There was a problem placing your order. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (!shippingDetails) {
    return <div className="container mx-auto text-center py-12">Loading...</div>;
  }

  return (
    <div className="bg-blue-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card className="shadow-none border-none bg-transparent">
              <CardContent className="p-0">
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg">
                    <h2 className="font-bold text-lg mb-2">Login</h2>
                    <p className="text-sm">
                      <span className="font-semibold">{user?.displayName || 'Valued Customer'}</span>{' '}
                      <span>{user?.email}</span>
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h2 className="font-bold text-lg mb-2">Delivery Address</h2>
                    <p className="text-sm">
                      <span className="font-semibold">{shippingDetails.shippingAddress.fullName}</span>, {shippingDetails.shippingAddress.address}, {shippingDetails.shippingAddress.city}, {shippingDetails.shippingAddress.zipCode}, {shippingDetails.shippingAddress.country}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h2 className="font-bold text-lg mb-2">Order Summary</h2>
                    {/* Item details can be shown here if needed */}
                    <p className="text-sm">Your items will be delivered soon.</p>
                  </div>

                  {/* Payment Options */}
                  <div className="bg-white p-6 rounded-lg">
                    <h2 className="font-bold text-lg mb-4 uppercase text-gray-500">
                      Payment Options
                    </h2>
                    <Accordion type="single" collapsible className="w-full">
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
                            <CreditCard className="h-5 w-5" /> Credit/Debit Card
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="p-4 pt-0">
                           <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                              Enter your card details
                            </p>
                            <div className="space-y-2">
                              <Input placeholder="Card Number" />
                              <div className="flex gap-2">
                                <Input placeholder="MM / YY" />
                                <Input placeholder="CVV" />
                              </div>
                            </div>
                             <Button className="w-full" onClick={() => handlePayment('Credit Card')}>Pay {formatCurrency(totalAmount)}</Button>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="wallet">
                         <AccordionTrigger className="p-4 hover:no-underline font-semibold">
                          <div className="flex items-center gap-3">
                            <Wallet className="h-5 w-5" /> Wallet
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="p-4 pt-0">
                           <p className="text-sm text-muted-foreground">Connect your wallet to proceed.</p>
                           <Button className="w-full mt-2" onClick={() => handlePayment('Wallet')}>Connect Wallet</Button>
                        </AccordionContent>
                      </AccordionItem>
                      
                       <AccordionItem value="net-banking">
                         <AccordionTrigger className="p-4 hover:no-underline font-semibold">
                          <div className="flex items-center gap-3">
                            <Landmark className="h-5 w-5" /> Net Banking
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="p-4 pt-0">
                           <p className="text-sm text-muted-foreground">Select your bank to proceed.</p>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="cod">
                        <AccordionTrigger className="p-4 hover:no-underline font-semibold">
                          <div className="flex items-center gap-3">
                            <IndianRupee className="h-5 w-5" /> Cash on Delivery
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="p-4 pt-0">
                           <p className="text-sm text-muted-foreground">Pay with cash upon delivery.</p>
                           <Button className="w-full mt-2" onClick={() => handlePayment('Cash on Delivery')}>Confirm Order</Button>
                        </AccordionContent>
                      </AccordionItem>

                       <AccordionItem value="emi">
                        <AccordionTrigger className="p-4 hover:no-underline font-semibold">
                          <div className="flex items-center gap-3">
                            <IndianRupee className="h-5 w-5" /> EMI (Easy Installments)
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="p-4 pt-0">
                           <p className="text-sm text-muted-foreground">Pay in easy installments.</p>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                     <p className="text-xs text-center text-muted-foreground mt-4">
                      35 Crore happy customers. 100% Secure payments.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-1">
            <Card className="shadow-none border-none bg-transparent">
              <CardContent className="p-6 bg-white rounded-lg">
                <h3 className="uppercase text-gray-500 font-bold mb-4">
                  Price Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Price ({cart.length} items)</span>
                    <span>{formatCurrency(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount</span>
                    <span className="text-green-600">-{formatCurrency(discount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Charges</span>
                    <span>{formatCurrency(deliveryFee)}</span>
                  </div>
                  <div className="border-t border-dashed my-2"></div>
                  <div className="flex justify-between font-bold text-base">
                    <span>Total Amount</span>
                    <span>{formatCurrency(totalAmount)}</span>
                  </div>
                  <div className="border-t border-dashed my-2"></div>
                </div>
                <p className="text-xs text-green-600 font-semibold mt-4">
                  You will save {formatCurrency(discount)} on this order
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
