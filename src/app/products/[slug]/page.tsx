import { notFound } from 'next/navigation';
import { products } from '@/lib/products';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import AddToCartButton from '@/components/cart/add-to-cart-button';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import ProductRecommendations from '@/components/product/product-recommendations';

type ProductPageProps = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = products.find((p) => p.slug === params.slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-start">
        <Card className="overflow-hidden">
          <div className="relative aspect-[3/4] w-full">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              data-ai-hint={product.imageHint}
              priority
            />
          </div>
        </Card>

        <div className="space-y-6">
          <div className="space-y-2">
            <Badge variant="secondary">{product.category}</Badge>
            <h1 className="text-3xl md:text-4xl font-bold font-headline">
              {product.name}
            </h1>
            <p className="text-3xl font-bold text-primary">
              {formatCurrency(product.price)}
            </p>
          </div>
          <p className="text-lg text-muted-foreground">
            {product.longDescription}
          </p>
          <AddToCartButton
            product={product}
            size="lg"
            className="w-full md:w-auto"
          />
        </div>
      </div>
      <div className="mt-16 md:mt-24">
        <ProductRecommendations
          browsingHistory={product.name}
          purchaseHistory=""
        />
      </div>
    </div>
  );
}
