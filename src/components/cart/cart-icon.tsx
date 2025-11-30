'use client';

import { useCart } from '@/contexts/cart-context';
import { ShoppingBag } from 'lucide-react';
import { Button } from '../ui/button';

export default function CartIcon() {
  const { totalItems, setIsCartOpen } = useCart();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      onClick={() => setIsCartOpen(true)}
    >
      <ShoppingBag className="h-6 w-6" />
      {totalItems > 0 && (
        <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
          {totalItems}
        </span>
      )}
      <span className="sr-only">Open cart</span>
    </Button>
  );
}
