'use client';
import Link from 'next/link';
import { Package, User, Menu, LogOut } from 'lucide-react';
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
    <div className="flex flex-col gap-4 text-lg font-medium">
      <NavLink href="/" onClick={() => setIsMobileMenuOpen(false)}>Home</NavLink>
      <NavLink href="/#products" onClick={() => setIsMobileMenuOpen(false)}>Products</NavLink>
      {user && <NavLink href="/account" onClick={() => setIsMobileMenuOpen(false)}>My Account</NavLink>}
    </div>
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
          <NavLink href="/">Home</NavLink>
          <NavLink href="/#products">Products</NavLink>
          {user && <NavLink href="/account">My Account</NavLink>}
        </nav>

        <div className="flex items-center gap-4">
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
                    <Package className="h-7 w-7 text-primary" />
                    <span className="text-xl font-bold font-headline">AnimEcom</span>
                  </Link>
                  <nav>{navLinks}</nav>
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

          {!isUserLoading && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hidden md:flex">
                  <User className="h-6 w-6" />
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

          <CartIcon />
        </div>
      </div>
    </header>
  );
}
