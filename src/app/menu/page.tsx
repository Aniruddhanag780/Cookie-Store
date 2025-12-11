import ProductGrid from '@/components/product/product-grid';
import { products } from '@/lib/products';

export default function MenuPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">
          Our Menu
        </h1>
        <p className="max-w-2xl mx-auto text-muted-foreground">
          Browse our selection of delicious, freshly baked goods.
        </p>
      </div>
      <ProductGrid products={products} />
    </div>
  );
}
