
'use client';

import { useCart } from '@/contexts/cart-context';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function CartPage() {
  const {
    cart,
    cartTotal,
    removeFromCart,
    updateQuantity,
  } = useCart();

  if (cart.length === 0) {
    return (
       <div className="min-h-[calc(100vh-20rem)] flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-3xl md:text-4xl font-bold font-headline mb-4">
          Your Cart is Empty
        </h1>
        <p className="text-muted-foreground mb-8">
          Looks like you haven&apos;t added anything to your cart yet.
        </p>
        <Button asChild>
          <Link href="/#products">Continue Shopping</Link>
        </Button>
      </div>
    )
  }

  const deliveryFee = cartTotal > 0 ? 15 : 0;
  const discount = cartTotal > 100 ? cartTotal * 0.2 : 0; // e.g. 20% discount on orders over $100
  const total = cartTotal - discount + deliveryFee;


  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-sm text-muted-foreground mb-4">
            Home &gt; <span className="text-foreground">Cart</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold font-headline mb-8 uppercase">
          Your Cart
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <Card key={item.id} className="bg-card shadow-sm border">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="relative h-28 w-28 overflow-hidden rounded-lg bg-gray-100">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">Size: Large</p>
                      <p className="text-sm text-muted-foreground">Color: White</p>
                      <p className="font-bold text-xl mt-2">{formatCurrency(item.price)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                     <div className="flex items-center gap-2 rounded-full bg-secondary p-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 rounded-full text-muted-foreground hover:bg-muted"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                           variant="ghost"
                           size="icon"
                           className="h-7 w-7 rounded-full text-muted-foreground hover:bg-muted"
                           onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="lg:col-span-1">
            <Card className="bg-card shadow-sm border sticky top-24">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-lg">
                  <span>Subtotal</span>
                  <span>{formatCurrency(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span>Discount (-20%)</span>
                  <span className="text-red-500">-{formatCurrency(discount)}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span>Delivery Fee</span>
                  <span>{formatCurrency(deliveryFee)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-xl">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
                 <div className="relative flex items-center">
                    <Input placeholder="Add promo code" className="bg-secondary border-none rounded-full h-12 pr-24"/>
                    <Button className="absolute right-1 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full h-10 px-6">Apply</Button>
                </div>

                <Button asChild size="lg" className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full font-bold text-base">
                  <Link href="/checkout">Go to Checkout &rarr;</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
