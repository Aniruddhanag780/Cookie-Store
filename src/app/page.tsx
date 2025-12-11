
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

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
  const heroImages = PlaceHolderImages.filter((img) =>
    img.id.startsWith('hero-')
  );
  const visitImage1 = PlaceHolderImages.find((img) => img.id === 'visit-1');
  const visitImage2 = PlaceHolderImages.find((img) => img.id === 'visit-2');

  return (
    <div className="flex flex-col gap-16 md:gap-24">
      <section className="relative w-full">
        <Carousel
          className="w-full"
          opts={{
            loop: true,
          }}
        >
          <CarouselContent>
            {heroImages.map((heroImage) => (
              <CarouselItem key={heroImage.id}>
                <div className="relative w-full aspect-[16/9]">
                  <Image
                    src={heroImage.imageUrl}
                    alt={heroImage.description}
                    fill
                    className="object-cover"
                    priority={heroImages.indexOf(heroImage) === 0}
                    data-ai-hint={heroImage.imageHint}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent" />
                  <div className="relative h-full flex flex-col items-center justify-center text-center text-foreground p-4">
                    <div
                      style={{ animationDelay: '0.2s' }}
                      className="animate-fade-in opacity-0"
                    >
                      <p className="text-lg md:text-xl text-muted-foreground mb-2">
                        FRESHLY BAKED EVERY MORNING
                      </p>
                      <h1 className="text-4xl md:text-7xl font-bold font-headline mb-4 text-shadow-lg">
                        Freshly Baked,
                        <br />
                        Just for You!
                      </h1>

                      <Button
                        asChild
                        size="lg"
                        className="group bg-primary text-primary-foreground font-bold text-lg mt-4"
                      >
                        <Link href="#">
                          Order Now{' '}
                          <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex" />
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex" />
        </Carousel>
      </section>

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
