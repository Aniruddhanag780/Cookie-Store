import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { products } from '@/lib/products';
import ProductGrid from '@/components/product/product-grid';
import ProductRecommendations from '@/components/product/product-recommendations';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import WelcomeEmailForm from '@/components/welcome-email-form';

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-main');

  return (
    <div className="flex flex-col gap-16 md:gap-24">
      <section className="bg-card border-b py-8 md:py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold font-headline mb-2">
            Join Our Community
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Enter your email to receive a warm welcome and stay updated on the
            latest drops from the future of fashion.
          </p>
          <WelcomeEmailForm />
        </div>
      </section>

      <section className="relative h-[60dvh] md:h-[80dvh] w-full">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            priority
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="relative h-full flex flex-col items-center justify-center text-center text-white p-4">
          <div
            style={{ animationDelay: '0.2s' }}
            className="animate-fade-in opacity-0"
          >
            <h1 className="text-4xl md:text-7xl font-bold font-headline mb-4 text-shadow-lg">
              Define Tomorrow&apos;s Aesthetic
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-neutral-200 mb-8">
              Explore our curated collection of avant-garde fashion and techwear.
              Push boundaries, wear the future.
            </p>
            <Button
              asChild
              size="lg"
              className="group bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg"
            >
              <Link href="#products">
                Shop Now{' '}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section
        id="products"
        className="container mx-auto px-4"
        style={{ animationDelay: '0.4s' }}
      >
        <div className="animate-fade-in opacity-0">
          <h2 className="text-3xl md:text-4xl font-bold text-center font-headline mb-12">
            Our Collection
          </h2>
          <ProductGrid products={products} />
        </div>
      </section>

      <section
        className="container mx-auto px-4"
        style={{ animationDelay: '0.6s' }}
      >
        <div className="animate-fade-in opacity-0">
          <ProductRecommendations
            // Simulate user history for demonstration
            browsingHistory="Chrono-Gauntlet, Quantum Visor"
            purchaseHistory="Aether-Weave Hoodie"
          />
        </div>
      </section>
    </div>
  );
}
