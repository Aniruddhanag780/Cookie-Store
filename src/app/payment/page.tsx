
'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useCart } from '@/contexts/cart-context';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  ChevronDown,
  ShieldCheck,
  Landmark,
  Wallet,
  CreditCard,
  IndianRupee,
  CalendarDays,
  Smile,
  HelpCircle,
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useFirestore, useUser } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';


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

const FlipkartIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M10 4H4v6h6V4z" fill="#2874F0"></path>
    <path d="M10 10H4v6h6v-6z" fill="#2874F0"></path>
    <path d="M10 16H4v6h6v-6z" fill="#2874F0"></path>
    <path d="M16 4h-6v6h6V4z" fill="#F4B000"></path>
    <path d="M22 4h-6v6h6V4z" fill="#F4B000"></path>
    <path d="M16 10h-6v6h6v-6z" fill="#F4B000"></path>
  </svg>
);

export default function PaymentPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  const firestore = useFirestore();
  const { user } = useUser();


  const deliveryFee = cartTotal > 0 ? 15 : 0;
  const discount = cartTotal > 100 ? cartTotal * 0.2 : 0; // e.g. 20% discount on orders over $100
  const totalWithFees = cartTotal - discount + deliveryFee;

  const handlePayment = async (paymentMethod: string) => {
    if (!firestore || !user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to place an order.',
        variant: 'destructive',
      });
      return;
    }

    const shippingDetailsString = sessionStorage.getItem('shippingDetails');
    if (!shippingDetailsString) {
        toast({
            title: 'Error',
            description: 'Shipping details not found. Please go back to checkout.',
            variant: 'destructive',
        });
        router.push('/checkout');
        return;
    }
    const shippingDetails = JSON.parse(shippingDetailsString);

    try {
      // 1. Create a new order document in Firestore
      const ordersCollection = collection(firestore, 'orders');
      await addDoc(ordersCollection, {
        userId: user.uid,
        userEmail: user.email,
        date: serverTimestamp(),
        status: 'Processing',
        total: totalWithFees,
        paymentMethod: paymentMethod,
        shippingAddress: {
            fullName: shippingDetails.fullName,
            address: shippingDetails.address,
            city: shippingDetails.city,
            zipCode: shippingDetails.zipCode,
            country: shippingDetails.country,
        },
        billingAddress: shippingDetails.sameAsShipping ? {
            fullName: shippingDetails.fullName,
            address: shippingDetails.address,
            city: shippingDetails.city,
            zipCode: shippingDetails.zipCode,
            country: shippingDetails.country,
        } : {
            fullName: shippingDetails.billingFullName,
            address: shippingDetails.billingAddress,
            city: shippingDetails.billingCity,
            zipCode: shippingDetails.billingZipCode,
            country: shippingDetails.billingCountry,
        },
        items: cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            imageHint: item.imageHint,
            slug: item.slug,
            category: item.category,
            description: item.description,
            longDescription: item.longDescription,
        })),
      });

      // 2. Clear the user's cart and shipping details
      clearCart();
      sessionStorage.removeItem('shippingDetails');

      // 3. Redirect to the order confirmation page
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

  if (cart.length === 0) {
    // Redirect if cart is empty, maybe after a delay
    if (typeof window !== 'undefined') {
        // Also clear shipping details if cart is empty
        sessionStorage.removeItem('shippingDetails');
        router.push('/');
    }
    return (
      <div className="container mx-auto px-4 py-8 md:py-12 text-center">
        <h1 className="text-2xl font-bold">Your cart is empty.</h1>
        <p className="text-muted-foreground">
          Redirecting you to the home page...
        </p>
      </div>
    );
  }

  const totalAmountFormatted = formatCurrency(totalWithFees, 'INR').split('.')[0];


  return (
    <div className="bg-secondary/30 min-h-screen">
      <div className="max-w-md mx-auto bg-background shadow-md">
        <header className="p-4 flex items-center justify-between border-b">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              aria-label="Go back"
            >
              <ArrowLeft />
            </Button>
            <div>
              <p className="text-sm text-muted-foreground">Step 3 of 3</p>
              <h1 className="text-2xl font-bold">Payments</h1>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground bg-secondary px-2 py-1 rounded-full">
            <ShieldCheck className="h-4 w-4 text-green-600" />
            100% Secure
          </div>
        </header>

        <main className="p-4 space-y-4">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-blue-800">
                  Total Amount
                </span>
                <ChevronDown className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-blue-800">
                {totalAmountFormatted}
              </span>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-green-700">5% Cashback</h3>
                <p className="text-sm text-green-600">
                  Claim now with payment offers
                </p>
              </div>
              <div className="flex items-center -space-x-2">
                <div className="h-8 w-8 rounded-full bg-white border-2 border-green-200 flex items-center justify-center">
                  <Landmark className="h-4 w-4 text-green-600" />
                </div>
                <div className="h-8 w-8 rounded-full bg-white border-2 border-green-200 flex items-center justify-center">
                  <Wallet className="h-4 w-4 text-green-600" />
                </div>
                <div className="h-8 w-8 rounded-full bg-white border-2 border-green-200 flex items-center justify-center font-bold text-green-600 text-xs">
                  +3
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Checkbox id="gift-card" />
                <div>
                  <label htmlFor="gift-card" className="font-semibold">
                    Use Gift Card
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Available Balance ₹34
                  </p>
                </div>
              </div>
              <Button variant="link" className="text-primary">
                Add Gift Card
              </Button>
            </div>

            <Card>
              <CardHeader className="flex flex-row items-center gap-3 pb-4">
                <FlipkartIcon />
                <CardTitle className="text-lg flex-1">Flipkart UPI</CardTitle>
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                  New
                </span>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => handlePayment('Flipkart UPI')}
                >
                  Add Bank and Pay
                </Button>
              </CardContent>
            </Card>

            <Accordion
              type="single"
              collapsible
              className="w-full bg-white rounded-lg border"
              defaultValue="credit-card"
            >
              <AccordionItem value="upi">
                <AccordionTrigger className="p-4 font-semibold hover:no-underline">
                  <div className="flex items-center gap-3">
                    <UpiIcon />
                    UPI
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
                        variant="outline"
                        className="border-primary text-primary"
                        onClick={() => handlePayment('UPI')}
                      >
                        Verify
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="credit-card">
                 <AccordionTrigger className="p-4 hover:no-underline">
                   <div className='flex flex-col items-start gap-1'>
                    <div className="flex items-center gap-3 font-semibold">
                      <CreditCard className="h-5 w-5" />
                      Credit / Debit / ATM Card
                    </div>
                    <p className='text-xs text-muted-foreground font-normal'>Add and secure cards as per RBI guidelines</p>
                    <p className='text-xs text-green-600 font-semibold'>Get upto 5% cashback • 2 offers available</p>
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
                     <Button
                       className="w-full"
                       onClick={() => handlePayment('Credit Card')}
                     >
                       Pay {totalAmountFormatted}
                     </Button>
                   </div>
                 </AccordionContent>
              </AccordionItem>
              <AccordionItem value="cod">
                 <AccordionTrigger className="p-4 font-semibold hover:no-underline">
                   <div className="flex items-center gap-3">
                     <IndianRupee className="h-5 w-5" />
                     Cash on Delivery
                   </div>
                 </AccordionTrigger>
                 <AccordionContent className="p-4 pt-0">
                   <div className="space-y-4">
                     <p className="text-sm text-muted-foreground">
                       Pay with cash upon delivery of your order.
                     </p>
                     <Button
                       className="w-full"
                       onClick={() => handlePayment('Cash on Delivery')}
                     >
                       Confirm Order
                     </Button>
                   </div>
                 </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            <div className="border rounded-lg p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <CalendarDays className="h-5 w-5 text-muted-foreground" />
                    <span className="font-semibold">EMI</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm text-muted-foreground">Unavailable</span>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </div>
            </div>

            <div className="text-center p-4 space-y-2">
                <Smile className="h-8 w-8 text-muted-foreground mx-auto" />
                <p className="text-sm text-muted-foreground">
                  35 Crore happy customers and counting!
                </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
