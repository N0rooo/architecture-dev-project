'use client';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const response = await fetch('/api/auth/signout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      router.push('/login');
    }
  };
  return (
    <Button className="cursor-pointer" size="icon" variant="outline" onClick={logout}>
      <LogOut />
    </Button>
  );
}
