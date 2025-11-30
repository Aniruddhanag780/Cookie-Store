'use client';

import { useCart } from '@/contexts/cart-context';
import type { Product } from '@/lib/types';
import { Button, type ButtonProps } from '../ui/button';
import { ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddToCartButtonProps extends ButtonProps {
  product: Product;
  showIcon?: boolean;
}

export default function AddToCartButton({
  product,
  showIcon = true,
  className,
  ...props
}: AddToCartButtonProps) {
  const { addToCart } = useCart();

  return (
    <Button
      onClick={() => addToCart(product)}
      className={cn('gap-2', className)}
      {...props}
    >
      {showIcon && <ShoppingCart className="h-4 w-4" />}
      Add to Cart
    </Button>
  );
}
