
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
import { useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { useEffect, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { IndianRupee, CreditCard } from 'lucide-react';
import { useFirestore, useUser } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

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


const formSchema = z
  .object({
    // Shipping
    fullName: z.string().min(2, 'Full name is required.'),
    address: z.string().min(5, 'A valid address is required.'),
    city: z.string().min(2, 'City is required.'),
    zipCode: z.string().min(5, 'A valid ZIP code is required.'),
    country: z.string().min(2, 'Country is required.'),
    // Billing
    sameAsShipping: z.boolean().default(true),
    billingFullName: z.string().optional(),
    billingAddress: z.string().optional(),
    billingCity: z.string().optional(),
    billingZipCode: z.string().optional(),
    billingCountry: z.string().optional(),
    // Payment
    paymentMethod: z.enum(['Credit Card', 'UPI', 'Cash on Delivery'], {
      required_error: "Please select a payment method."
    }),
  })
  .refine(
    (data) => {
      if (!data.sameAsShipping) {
        return (
          !!data.billingFullName &&
          !!data.billingAddress &&
          !!data.billingCity &&
          !!data.billingZipCode &&
          !!data.billingCountry
        );
      }
      return true;
    },
    {
      message: 'Billing information is required when not same as shipping.',
      path: ['billingFullName'], 
    }
  );

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();

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
      sameAsShipping: true,
      billingFullName: '',
      billingAddress: '',
      billingCity: '',
      billingZipCode: '',
      billingCountry: '',
      paymentMethod: undefined,
    },
  });

  const sameAsShipping = form.watch('sameAsShipping');

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!firestore || !user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to place an order.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const ordersCollection = collection(firestore, 'orders');
      await addDoc(ordersCollection, {
        userId: user.uid,
        userEmail: user.email,
        date: serverTimestamp(),
        status: 'Processing',
        total: cartTotal,
        paymentMethod: values.paymentMethod,
        shippingAddress: {
            fullName: values.fullName,
            address: values.address,
            city: values.city,
            zipCode: values.zipCode,
            country: values.country,
        },
        billingAddress: values.sameAsShipping ? {
            fullName: values.fullName,
            address: values.address,
            city: values.city,
            zipCode: values.zipCode,
            country: values.country,
        } : {
            fullName: values.billingFullName,
            address: values.billingAddress,
            city: values.billingCity,
            zipCode: values.billingZipCode,
            country: values.billingCountry,
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

      clearCart();
      router.push('/order-confirmed');
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: 'Order Failed',
        description: 'There was a problem placing your order. Please try again.',
        variant: 'destructive',
      });
    }
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
                        <Input placeholder="123 Future Avenue" {...field} />
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
                <CardTitle>Billing Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="sameAsShipping"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          My billing address is the same as my shipping address.
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                {!sameAsShipping && (
                  <div className="space-y-4 pt-4">
                    <FormField
                      control={form.control}
                      name="billingFullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Jane Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="billingAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="456 Other World Way"
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
                        name="billingCity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="Alpha Centauri" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="billingZipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ZIP Code</FormLabel>
                            <FormControl>
                              <Input placeholder="90211" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="billingCountry"
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
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                       <FormControl>
                        <Accordion
                          type="single"
                          collapsible
                          className="w-full"
                          onValueChange={(value) => field.onChange(value as 'Credit Card' | 'UPI' | 'Cash on Delivery')}
                        >
                          <AccordionItem value="Credit Card">
                            <AccordionTrigger className="p-4 hover:no-underline">
                              <div className='flex flex-col items-start gap-1'>
                                <div className="flex items-center gap-3 font-semibold">
                                  <CreditCard className="h-5 w-5" />
                                  Credit / Debit / ATM Card
                                </div>
                                <p className='text-xs text-muted-foreground font-normal'>Add and secure cards as per RBI guidelines</p>
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
                                <p className="text-xs text-muted-foreground">This is a mock UI. Clicking "Place Order" will simulate a successful payment.</p>
                              </div>
                            </AccordionContent>
                          </AccordionItem>

                          <AccordionItem value="UPI">
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
                                    type="button"
                                    variant="outline"
                                    className="border-primary text-primary"
                                  >
                                    Verify
                                  </Button>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                          
                          <AccordionItem value="Cash on Delivery">
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
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                <Button type="submit" size="lg" className="w-full" disabled={form.formState.isSubmitting}>
                   {form.formState.isSubmitting ? "Placing Order..." : "Place Order"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </form>
      </Form>
    </div>
  );

    