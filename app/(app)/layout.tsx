import { Header } from '@/components/head/header';
import { MyTicketsProvider } from '@/context/myTicketsProvider';
import { ProfileProvider } from '@/context/profileProvider';
import { createAppServerClient } from '@/supabase/server';
import { redirect } from 'next/navigation';
import React from 'react';
export default async function layout({ children }: { children: React.ReactNode }) {
  const supabase = await createAppServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/connexion');
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <ProfileProvider user={user}>
        <Header user={user} />
        <section className="mt-11 flex-1 px-2">
          <MyTicketsProvider>{children}</MyTicketsProvider>
        </section>
      </ProfileProvider>
    </div>
  );
}
