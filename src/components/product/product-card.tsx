import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import AddToCartButton from '../cart/add-to-cart-button';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '../ui/badge';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="group overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="p-0">
        <Link href={`/products/${product.slug}`}>
          <div className="relative h-96 w-full">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={product.imageHint}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </Link>
      </CardHeader>
      <CardContent className="p-4">
        <Badge variant="secondary" className="mb-2">
          {product.category}
        </Badge>
        <h3 className="font-semibold text-lg truncate">
          <Link
            href={`/products/${product.slug}`}
            className="hover:text-primary transition-colors"
          >
            {product.name}
          </Link>
        </h3>
        <p className="text-muted-foreground text-sm truncate">
          {product.description}
        </p>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center">
        <p className="font-bold text-xl">{formatCurrency(product.price)}</p>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <AddToCartButton product={product} showIcon={false} />
        </div>
      </CardFooter>
    </Card>
  );
}
