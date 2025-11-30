'use client';
import Link from 'next/link';
import { Package, User, Menu } from 'lucide-react';
import CartIcon from '../cart/cart-icon';
import { Button } from '../ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import React from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const NavLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        'transition-colors hover:text-primary relative',
        isActive ? 'text-primary font-semibold' : 'text-muted-foreground'
      )}
    >
      {children}
      {isActive && (
        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2 h-[3px] bg-primary rounded-full" />
      )}
    </Link>
  );
};

export default function Header() {
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = (
    <>
      <NavLink href="/">Home</NavLink>
      <NavLink href="/#products">Products</NavLink>
      <NavLink href="/account">Account</NavLink>
    </>
  );

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full transition-all duration-300',
        isScrolled
          ? 'border-b bg-background/80 backdrop-blur-lg'
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Package className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold font-headline">AnimEcom</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks}
        </nav>

        <div className="flex items-center gap-4">
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="flex flex-col gap-6 p-6">
                  <Link href="/" className="flex items-center gap-2 mb-4">
                    <Package className="h-7 w-7 text-primary" />
                    <span className="text-xl font-bold font-headline">AnimEcom</span>
                  </Link>
                  <nav className="flex flex-col gap-4 text-lg font-medium">
                    <SheetClose asChild>{navLinks}</SheetClose>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <Button variant="ghost" size="icon" asChild className="hidden md:flex">
            <Link href="/account">
              <User className="h-6 w-6" />
              <span className="sr-only">Account</span>
            </Link>
          </Button>
          <CartIcon />
        </div>
      </div>
    </header>
  );
}
