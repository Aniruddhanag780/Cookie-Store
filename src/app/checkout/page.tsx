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

const formSchema = z.object({
  // Shipping
  fullName: z.string().min(2, 'Full name is required.'),
  address: z.string().min(5, 'A valid address is required.'),
  city: z.string().min(2, 'City is required.'),
  zipCode: z.string().min(5, 'A valid ZIP code is required.'),
  country: z.string().min(2, 'Country is required.'),
  // Payment
  cardName: z.string().min(2, 'Name on card is required.'),
  cardNumber: z
    .string()
    .min(16, 'Card number must be 16 digits.')
    .max(16, 'Card number must be 16 digits.'),
  cardExpiry: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Expiry must be in MM/YY format.'),
  cardCvc: z
    .string()
    .min(3, 'CVC must be 3 digits.')
    .max(4, 'CVC can be up to 4 digits.'),
});

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (cart.length === 0) {
      router.push('/');
    }
  }, [cart, router]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      address: '',
      city: '',
      zipCode: '',
      country: '',
      cardName: '',
      cardNumber: '',
      cardExpiry: '',
      cardCvc: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('Order placed:', values);
    toast({
      title: 'Order Placed!',
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
        Checkout
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid md:grid-cols-3 gap-8 lg:gap-12"
        >
          <div className="md:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="123 Future Avenue"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="Neo-Kyoto" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ZIP Code</FormLabel>
                        <FormControl>
                          <Input placeholder="90210" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input placeholder="USA" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="cardName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name on Card</FormLabel>
                      <FormControl>
                        <Input placeholder="John M. Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cardNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Card Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="•••• •••• •••• ••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="cardExpiry"
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
                    name="cardCvc"
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
                    <div key={item.id} className="flex justify-between items-start">
                       <div className="flex items-center gap-3">
                          <div className="relative h-12 w-12 rounded-md overflow-hidden">
                             <Image src={item.image} alt={item.name} fill className="object-cover" />
                          </div>
                          <div>
                              <p className="font-medium leading-tight">{item.name}</p>
                              <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                       </div>
                       <p className="font-medium text-right">{formatCurrency(item.price * item.quantity)}</p>
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
                        <p>Shipping</p>
                        <p>Free</p>
                    </div>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                    <p>Total</p>
                    <p>{formatCurrency(cartTotal)}</p>
                </div>
                 <Button type="submit" size="lg" className="w-full">
                    Place Order
                </Button>
              </CardContent>
            </Card>
          </div>
        </form>
      </Form>
    </div>
  );
}
