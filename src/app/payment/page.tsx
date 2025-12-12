
'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/contexts/cart-context';
import { formatCurrency } from '@/lib/utils';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { useEffect } from 'react';
import { CreditCard } from 'lucide-react';

const paymentSchema = z.object({
  cardNumber: z.string().refine((val) => /^\d{16}$/.test(val), {
    message: 'Card number must be 16 digits.',
  }),
  expiryDate: z.string().refine((val) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(val), {
    message: 'Expiry date must be in MM/YY format.',
  }),
  cvc: z.string().refine((val) => /^\d{3,4}$/.test(val), {
    message: 'CVC must be 3 or 4 digits.',
  }),
});

export default function PaymentPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    // If cart is empty, user probably shouldn't be here.
    if (cart.length === 0) {
      router.push('/');
    }
  }, [cart, router]);

  const form = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardNumber: '',
      expiryDate: '',
      cvc: '',
    },
  });

  function onSubmit(values: z.infer<typeof paymentSchema>) {
    // Here you would integrate with a real payment processor.
    // For this demo, we'll just simulate a successful payment.
    console.log('Payment details submitted:', values);
    toast({
      title: 'Payment Successful!',
      description: 'Thank you for your purchase. Your order is on its way.',
    });
    clearCart();
    router.push('/');
  }

  if (cart.length === 0) {
    return null; // or a loading state
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="text-3xl md:text-4xl font-bold font-headline mb-8 text-center">
        Payment
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid md:grid-cols-3 gap-8 lg:gap-12"
        >
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard /> Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="cardNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Card Number</FormLabel>
                      <FormControl>
                        <Input placeholder="0000 0000 0000 0000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="expiryDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiry Date</FormLabel>
                        <FormControl>
                          <Input placeholder="MM/YY" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cvc"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CVC</FormLabel>
                        <FormControl>
                          <Input placeholder="123" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-1">
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
                          <p className="font-medium leading-tight">
                            {item.name}
                          </p>
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
                <div className="flex justify-between font-bold text-lg">
                  <p>Total</p>
                  <p>{formatCurrency(cartTotal)}</p>
                </div>
                <Button type="submit" size="lg" className="w-full" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? 'Processing...' : `Pay ${formatCurrency(cartTotal)}`}
                </Button>
              </CardContent>
            </Card>
          </div>
        </form>
      </Form>
    </div>
  );
}
