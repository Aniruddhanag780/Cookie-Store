
'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useCart } from '@/contexts/cart-context';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';

export default function PaymentPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const { toast } = useToast();
  const router = useRouter();

  const handlePayment = () => {
    // Simulate payment processing
    console.log('Processing payment...');
    toast({
      title: 'Payment Successful!',
      description: 'Thank you for your purchase. Your order is on its way.',
    });
    clearCart();
    router.push('/account');
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12 text-center">
        <h1 className="text-2xl font-bold">Your cart is empty.</h1>
        <p className="text-muted-foreground">Redirecting you to the home page...</p>
        {/* Redirect if cart is empty, maybe after a delay */}
        {typeof window !== 'undefined' && router.push('/')}
      </div>
    );
  }

  const deliveryFee = 15;
  const discount = cartTotal > 0 ? cartTotal * 0.2 : 0;
  const totalWithFees = cartTotal - discount + deliveryFee;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="text-3xl md:text-4xl font-bold font-headline mb-8 text-center">
        Complete Your Payment
      </h1>
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Placeholder for payment form (e.g., Stripe Elements) */}
              <div className="h-48 flex items-center justify-center bg-gray-100 rounded-md">
                <p className="text-muted-foreground">
                  Payment form will be here.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-start"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 rounded-md overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium leading-tight">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="font-medium text-right">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <p>Subtotal</p>
                  <p>{formatCurrency(cartTotal)}</p>
                </div>
                 <div className="flex justify-between">
                  <span>Discount (-20%)</span>
                  <span className="text-red-500">-{formatCurrency(discount)}</span>
                </div>
                 <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>{formatCurrency(deliveryFee)}</span>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <p>Total</p>
                <p>{formatCurrency(totalWithFees)}</p>
              </div>
              <Button
                size="lg"
                className="w-full"
                onClick={handlePayment}
              >
                Pay Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
