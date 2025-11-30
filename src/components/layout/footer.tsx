import Link from 'next/link';
import { Package, Twitter, Instagram, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="flex flex-col gap-2">
            <Link href="/" className="flex items-center gap-2 mb-2">
              <Package className="h-7 w-7 text-primary" />
              <span className="text-xl font-bold font-headline">AnimEcom</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              The future of fashion, delivered today.
            </p>
            <p className="text-muted-foreground text-xs">
              &copy; {new Date().getFullYear()} AnimEcom. All rights reserved.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:col-span-2">
            <div className="flex flex-col gap-2 text-sm">
              <h4 className="font-semibold font-headline mb-2">Shop</h4>
              <Link href="/#products" className="text-muted-foreground hover:text-primary transition-colors">
                Apparel
              </Link>
              <Link href="/#products" className="text-muted-foreground hover:text-primary transition-colors">
                Footwear
              </Link>
              <Link href="/#products" className="text-muted-foreground hover:text-primary transition-colors">
                Accessories
              </Link>
            </div>
            <div className="flex flex-col gap-2 text-sm">
              <h4 className="font-semibold font-headline mb-2">Account</h4>
              <Link href="/login" className="text-muted-foreground hover:text-primary transition-colors">
                Login
              </Link>
              <Link href="/signup" className="text-muted-foreground hover:text-primary transition-colors">
                Sign Up
              </Link>
              <Link href="/account" className="text-muted-foreground hover:text-primary transition-colors">
                Order History
              </Link>
            </div>
            <div className="flex flex-col gap-2 text-sm">
              <h4 className="font-semibold font-headline mb-2">Connect</h4>
              <div className="flex gap-4">
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Instagram className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Facebook className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
