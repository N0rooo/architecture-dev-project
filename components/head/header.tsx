'use client';

import { CircleUserRound, LogOut, Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

import { cn } from '@/lib/utils';
import { User } from '@supabase/supabase-js';
import LogoutButton from './logoutButton';

const navigation = [
  { name: 'Accueil', href: '/' },
  { name: 'Tickets gratuits', href: '/ticket-gratuit' },
  { name: 'Mes tickets', href: '/mes-tickets' },
  { name: 'Leaderboard', href: '/leaderboard' },
];

export function Header({ user }: { user: User | null }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const getInitials = (email: string) => {
    if (!email) return '';
    const [firstPart] = email.split('@');
    return firstPart.charAt(0).toUpperCase();
  };

  const logout = async () => {
    try {
      const response = await fetch('/api/auth/signout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        router.push('/login');
      } else {
        // Handle non-ok response
        alert('Logout failed. Please try again.');
      }
    } catch (error) {
      // Handle network or other errors
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 fixed top-0 z-50 w-full border-b backdrop-blur">
      <div className="flex h-16 items-center justify-between px-10">
        <div className="flex items-center gap-2">
          <Link className="flex items-center" href="/">
            <span className="text-xl font-bold">Orluck</span>
          </Link>
        </div>

        {/* Desktop navigation */}

        <nav className="hidden items-center gap-6 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'hover:text-primary text-sm font-medium transition-colors',
                pathname === item.href ? 'text-primary' : 'text-muted-foreground',
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="ml-3 hidden items-center gap-2 md:flex">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarFallback>{getInitials(user?.email || '')}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/account">
                  <DropdownMenuItem>
                    <CircleUserRound />
                    <span>Profile</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem onClick={logout}>
                  <LogOut />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/login">Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile navigation */}

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger className="md:hidden" asChild>
            <Button className="md:hidden" size="icon" variant="ghost">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[240px] p-6 sm:w-[300px]" side="right">
            <SheetTitle className="flex items-center justify-between">
              <span className="text-lg font-bold">YourBrand</span>
            </SheetTitle>
            <div className="flex flex-col gap-4 py-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'hover:text-primary text-sm font-medium transition-colors',
                    pathname === item.href ? 'text-primary' : 'text-muted-foreground',
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="mt-4 flex flex-col gap-2 border-t pt-4">
                {user ? (
                  <>
                    <p className="text-muted-foreground text-sm">{user.email}</p>
                    <LogoutButton />
                  </>
                ) : (
                  <>
                    <Button variant="outline" asChild>
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        Sign In
                      </Link>
                    </Button>
                    <Button asChild>
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        Sign Up
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
