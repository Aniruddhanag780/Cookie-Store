'use client';

import { useCart } from '@/contexts/cart-context';
import { ShoppingBag } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';

export default function CartIcon() {
  const { totalItems } = useCart();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      asChild
    >
      <Link href="/cart">
        <ShoppingBag className="h-6 w-6" />
        {totalItems > 0 && (
          <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            {totalItems}
          </span>
        )}
        <span className="sr-only">Open cart</span>
      </Link>
    </Button>
  );
}
