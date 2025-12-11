
'use client';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { HeartHandshake, Lightbulb, PersonStanding, Briefcase } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';

const services = [
  {
    icon: Lightbulb,
    title: 'Problem Solving',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing.',
  },
  {
    icon: HeartHandshake,
    title: 'Relationships',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing.',
    highlighted: true,
  },
  {
    icon: PersonStanding,
    title: 'Identifying Passion',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing.',
  },
  {
    icon: Briefcase,
    title: 'Growth Career',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing.',
  },
];

const expertise = [
    { label: 'Experience', value: 85 },
    { label: 'Communication', value: 95 },
    { label: 'Service', value: 90 },
]

export default function AboutPage() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-2');
  const welcomeImage = PlaceHolderImages.find((img) => img.id === 'hero-3');
  const expertiseImage = PlaceHolderImages.find((img) => img.id === 'hero-1');

  return (
    <div className="animate-fade-in opacity-0">
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-headline leading-tight">
              Your Personality is What Makes Your Character
            </h1>
            <p className="text-muted-foreground text-lg">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
              tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
            </p>
            <div className="flex gap-4 justify-center md:justify-start">
              <Button size="lg" asChild>
                <Link href="#">Learn More</Link>
              </Button>
            </div>
          </div>
          {heroImage && (
             <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                <Image
                    src={heroImage.imageUrl}
                    alt="Founder smiling"
                    fill
                    className="object-cover"
                    data-ai-hint={heroImage.imageHint}
                />
             </div>
          )}
        </div>
      </section>

       <section className="bg-secondary/30 py-16 md:py-24">
         <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
                {welcomeImage && (
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                        <Image
                            src={welcomeImage.imageUrl}
                            alt="Welcome to Femine"
                            fill
                            className="object-cover"
                            data-ai-hint={welcomeImage.imageHint}
                        />
                    </div>
                )}
                <div className="space-y-6">
                    <h2 className="text-3xl md:text-4xl font-bold font-headline">Welcome To Femine</h2>
                    <p className="text-muted-foreground">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                    <div className="flex flex-wrap gap-4 text-center">
                        <div className="bg-primary/10 p-4 rounded-lg flex-1">
                            <p className="text-4xl font-bold text-primary">32</p>
                            <p className="text-sm font-semibold text-muted-foreground">Experience</p>
                        </div>
                         <div className="bg-secondary p-4 rounded-lg flex-1">
                            <p className="text-4xl font-bold text-primary">82</p>
                            <p className="text-sm font-semibold text-muted-foreground">Mentored</p>
                        </div>
                         <div className="bg-secondary p-4 rounded-lg flex-1">
                            <p className="text-4xl font-bold text-primary">28</p>
                            <p className="text-sm font-semibold text-muted-foreground">Certificates</p>
                        </div>
                    </div>
                </div>
            </div>
         </div>
       </section>

       <section className="container mx-auto px-4 py-16 md:py-24 text-center">
        <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4">We Can Help Transform You</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {services.map((service, index) => (
            <Card key={index} className={`p-6 text-center space-y-3 ${service.highlighted ? 'bg-primary/10' : ''}`}>
              <div className="inline-block bg-secondary p-4 rounded-full">
                <service.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">{service.title}</h3>
              <p className="text-muted-foreground">{service.description}</p>
               <Button variant="link" className="text-primary font-semibold">
                Learn More &rarr;
              </Button>
            </Card>
          ))}
        </div>
      </section>

       <section className="bg-secondary/30 py-16 md:py-24">
         <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
                 <div className="space-y-6">
                    <h2 className="text-3xl md:text-4xl font-bold font-headline">Proving Our Expertise</h2>
                    <p className="text-muted-foreground">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.
                    </p>
                    <div className="space-y-4">
                        {expertise.map((item) => (
                            <div key={item.label}>
                                <div className="flex justify-between mb-1 font-semibold">
                                    <span>{item.label}</span>
                                    <span>{item.value}%</span>
                                </div>
                                <Progress value={item.value} className="h-2" />
                            </div>
                        ))}
                    </div>
                     <Button size="lg" asChild>
                        <Link href="#">Learn More</Link>
                    </Button>
                </div>
                 {expertiseImage && (
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                        <Image
                            src={expertiseImage.imageUrl}
                            alt="Proving our expertise"
                            fill
                            className="object-cover"
                            data-ai-hint={expertiseImage.imageHint}
                        />
                    </div>
                )}
            </div>
         </div>
       </section>
    </div>
  );
}
