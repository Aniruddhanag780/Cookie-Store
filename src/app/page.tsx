
'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';
import { products } from '@/lib/products';
import { formatCurrency } from '@/lib/utils';
import AddToCartButton from '@/components/cart/add-to-cart-button';

const serviceCards = [
  {
    id: 'artisan-breads',
    title: 'Artisan Breads',
    description:
      'Our breads are made daily from scratch using traditional methods and the finest ingredients.',
    imageHint: 'artisan bread',
  },
  {
    id: 'sweet-pastries',
    title: 'Sweet Pastries',
    description:
      'Indulge in our wide selection of sweet pastries, from flaky croissants to rich Danishes.',
    imageHint: 'sweet pastry',
  },
  {
    id: 'custom-cakes',
    title: 'Custom Cakes',
    description:
      'Celebrate your special moments with a custom-designed cake, tailored to your taste.',
    imageHint: 'custom cake',
  },
];

export default function Home() {
  const visitImage1 = PlaceHolderImages.find((img) => img.id === 'visit-1');
  const visitImage2 = PlaceHolderImages.find((img) => img.id === 'visit-2');
  const featuredProduct = products.find(p => p.id === '13');

  return (
    <div className="flex flex-col gap-16 md:gap-24">
      
      <section
        id="why-choose-us"
        className="container mx-auto px-4"
        style={{ animationDelay: '0.4s' }}
      >
        <div className="animate-fade-in opacity-0 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4">
            Why Choose Us?
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground mb-12">
            We are dedicated to providing the best tasting, highest quality
            baked goods. Our commitment to freshness and flavor is unmatched.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {serviceCards.map((card) => {
              const cardImage = PlaceHolderImages.find(
                (img) => img.id === card.id
              );
              return (
                <Card
                  key={card.id}
                  className="bg-card border-none overflow-hidden text-center shadow-lg"
                >
                  {cardImage && (
                    <div className="relative h-64 w-full">
                      <Image
                        src={cardImage.imageUrl}
                        alt={card.title}
                        fill
                        className="object-cover"
                        data-ai-hint={card.imageHint}
                      />
                    </div>
                  )}
                  <CardContent className="p-6 space-y-2">
                    <h3 className="text-2xl font-bold font-headline">
                      {card.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {card.description}
                    </p>
                    <Button variant="link" className="text-primary font-bold">
                      Visit Bakery
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {featuredProduct && (
        <section
          id="featured-product"
          className="container mx-auto px-4 bg-secondary/30 rounded-lg py-12"
          style={{ animationDelay: '0.5s' }}
        >
          <div className="animate-fade-in opacity-0 grid md:grid-cols-2 gap-8 items-center">
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
              <Image
                src={featuredProduct.image}
                alt={featuredProduct.name}
                fill
                className="object-cover"
                data-ai-hint={featuredProduct.imageHint}
              />
            </div>
            <div className="space-y-4 text-center md:text-left">
              <h3 className="text-sm font-bold uppercase tracking-widest text-primary">Featured Product</h3>
              <h2 className="text-3xl md:text-4xl font-bold font-headline">
                {featuredProduct.name}
              </h2>
              <p className="text-muted-foreground text-lg">
                {featuredProduct.description}
              </p>
              <div className="flex items-center justify-center md:justify-start gap-4">
                 <p className="text-3xl font-bold text-primary">
                    {formatCurrency(featuredProduct.price)}
                 </p>
                 <AddToCartButton product={featuredProduct} size="lg" />
              </div>
            </div>
          </div>
        </section>
      )}

      <section
        id="visit-us-today"
        className="container mx-auto px-4"
        style={{ animationDelay: '0.6s' }}
      >
        <div className="animate-fade-in opacity-0 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold font-headline">
              Visit Us Today
            </h2>
            <p className="text-muted-foreground text-lg">
              Experience the aroma of freshly baked goods and enjoy a cup of
              our signature coffee. Our cozy bakery is the perfect place to
              relax and treat yourself.
            </p>
            <p className="text-muted-foreground">
              We are located in the heart of the city, ready to serve you the
              best pastries and breads you've ever tasted. Come by and say
              hello!
            </p>
            <Button
              asChild
              size="lg"
              className="group bg-primary text-primary-foreground font-bold"
            >
              <Link href="#">Visit Us Today</Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {visitImage1 && (
              <div className="relative aspect-square">
                <Image
                  src={visitImage1.imageUrl}
                  alt={visitImage1.description}
                  fill
                  className="object-cover rounded-lg"
                  data-ai-hint={visitImage1.imageHint}
                />
              </div>
            )}
            {visitImage2 && (
              <div className="relative aspect-square">
                <Image
                  src={visitImage2.imageUrl}
                  alt={visitImage2.description}
                  fill
                  className="object-cover rounded-lg"
                  data-ai-hint={visitImage2.imageHint}
                />
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
