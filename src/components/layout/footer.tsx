
import Link from 'next/link';
import { Facebook, Github, Instagram, Twitter } from 'lucide-react';
import WelcomeEmailForm from '../welcome-email-form';

const footerLinks = [
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Features', href: '#' },
      { label: 'Works', href: '#' },
      { label: 'Career', href: '#' },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'Customer Support', href: '/contact' },
      { label: 'Delivery Details', href: '#' },
      { label: 'Terms & Conditions', href: '#' },
      { label: 'Privacy Policy', href: '#' },
      { label: 'FAQ', href: '/faq' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Free eBooks', href: '#' },
      { label: 'Development Tutorial', href: '#' },
      { label: 'How to - Blog', href: '#' },
      { label: 'Youtube Playlist', href: '#' },
    ],
  },
];

const PaymentIcons = () => (
    <div className="flex items-center gap-2">
        <img src="https://img.icons8.com/color/48/visa.png" alt="Visa" className="h-6" />
        <img src="https://img.icons8.com/color/48/mastercard.png" alt="Mastercard" className="h-6" />
        <img src="https://img.icons8.com/color/48/paypal.png" alt="PayPal" className="h-6" />
        <img src="https://img.icons8.com/color/48/apple-pay.png" alt="Apple Pay" className="h-6" />
        <img src="https://img.icons8.com/color/48/google-pay.png" alt="Google Pay" className="h-6" />
    </div>
);

export default function Footer() {
  return (
    <footer className="mt-16 md:mt-24 bg-footer">
      <section className="py-12 bg-primary/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <h2 className="text-3xl md:text-4xl font-bold font-headline max-w-lg leading-tight uppercase text-center md:text-left">
              Stay up to date about our latest offers
            </h2>
            <div className="w-full md:max-w-md">
              <WelcomeEmailForm />
            </div>
          </div>
        </div>
      </section>
      
      <section className="text-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 md:grid-cols-5">
            <div className="flex flex-col gap-4 md:col-span-2 lg:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-2">
                <span className="text-2xl font-bold font-headline uppercase tracking-widest text-foreground">Bakery</span>
              </Link>
              <p className="text-sm max-w-xs text-muted-foreground">
                We have breads, pastries, and cakes that suit your taste. Freshly baked for you.
              </p>
              <div className="flex gap-4 mt-2">
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><Twitter className="h-5 w-5" /></Link>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><Facebook className="h-5 w-5" /></Link>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><Instagram className="h-5 w-5" /></Link>
                  <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><Github className="h-5 w-5" /></Link>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 md:col-span-3 lg:col-span-4">
              {footerLinks.map((section) => (
                <div key={section.title} className="flex flex-col gap-3 text-sm">
                  <h4 className="font-semibold font-headline uppercase tracking-wider mb-2 text-foreground">{section.title}</h4>
                  {section.links.map((link) => (
                    <Link key={link.label} href={link.href} className="text-muted-foreground hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <hr className="my-8 border-border" />
           <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
             <p className="text-muted-foreground">Bakery © 2024, All Rights Reserved</p>
             <PaymentIcons />
          </div>
        </div>
      </section>
    </footer>
  );
}
