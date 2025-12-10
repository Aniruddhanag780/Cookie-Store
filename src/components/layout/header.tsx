
'use client';
import Link from 'next/link';
import { User, Menu, LogOut, ShoppingBag, Twitter, Facebook, Instagram, Github } from 'lucide-react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

const NavLink = ({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'transition-colors hover:text-primary uppercase tracking-wider font-medium relative text-sm',
        isActive ? 'text-primary' : 'text-foreground'
      )}
    >
      {children}
    </Link>
  );
};

export default function Header() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to log out.', variant: 'destructive' });
    }
  };

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = (
    <>
      <NavLink href="/" onClick={() => setIsMobileMenuOpen(false)}>Home</NavLink>
      <NavLink href="/#why-choose-us" onClick={() => setIsMobileMenuOpen(false)}>Menu</NavLink>
      <NavLink href="/#visit-us-today" onClick={() => setIsMobileMenuOpen(false)}>About</NavLink>
      <NavLink href="#" onClick={() => setIsMobileMenuOpen(false)}>Contact Us</NavLink>
    </>
  );

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full transition-shadow duration-300',
        isScrolled
          ? 'shadow-md bg-background/80 backdrop-blur-lg'
          : 'bg-background'
      )}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold font-headline uppercase tracking-widest">Bakery</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2">
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><Twitter className="h-4 w-4" /></Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><Facebook className="h-4 w-4" /></Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><Instagram className="h-4 w-4" /></Link>
          </div>
          <Button asChild className="hidden md:inline-flex bg-primary text-primary-foreground hover:bg-primary/90 rounded-full">
            <Link href="#">Order Now</Link>
          </Button>

          <CartIcon />
          
          {!isUserLoading && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Account</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {user ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/account">My Account</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/login">Login</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/signup">Sign Up</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="flex flex-col gap-6 p-6">
                  <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 mb-4">
                     <span className="text-2xl font-bold font-headline uppercase tracking-widest">Bakery</span>
                  </Link>
                  <nav className="flex flex-col gap-4 text-lg">
                    {navLinks}
                    {user && <NavLink href="/account" onClick={() => setIsMobileMenuOpen(false)}>My Account</NavLink>}
                  </nav>
                  <Button asChild className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full">
                    <Link href="#">Order Now</Link>
                  </Button>
                  <div className="mt-auto">
                    {user ? (
                      <Button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="w-full">
                        <LogOut className="mr-2 h-4 w-4" /> Logout
                      </Button>
                    ) : (
                      <div className="space-y-2">
                        <SheetClose asChild>
                           <Button asChild className="w-full">
                              <Link href="/login">Login</Link>
                           </Button>
                        </SheetClose>
                         <SheetClose asChild>
                           <Button asChild variant="secondary" className="w-full">
                              <Link href="/signup">Sign Up</Link>
                           </Button>
                         </SheetClose>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
