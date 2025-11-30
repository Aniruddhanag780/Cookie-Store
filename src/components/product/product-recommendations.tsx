'use client';

import { useEffect, useState, useTransition } from 'react';
import { getRecommendedProducts } from '@/app/lib/actions';
import type { Product } from '@/lib/types';
import ProductCard from './product-card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

interface ProductRecommendationsProps {
  browsingHistory: string;
  purchaseHistory: string;
}

export default function ProductRecommendations({
  browsingHistory,
  purchaseHistory,
}: ProductRecommendationsProps) {
  const [recommended, setRecommended] = useState<Product[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const products = await getRecommendedProducts({
        browsingHistory,
        purchaseHistory,
      });
      setRecommended(products);
    });
  }, [browsingHistory, purchaseHistory]);

  return (
    <div className="space-y-8">
      <h2 className="text-3xl md:text-4xl font-bold text-center font-headline">
        Recommended For You
      </h2>
      {isPending ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-96 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-5 w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {recommended.map((product, index) => (
              <CarouselItem
                key={product.id}
                className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
              >
                <div className="p-1">
                  <ProductCard product={product} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      )}
    </div>
  );
}
