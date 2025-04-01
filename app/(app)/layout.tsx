import { Header } from '@/components/head/header';
import { createAppServerClient } from '@/supabase/server';
import { redirect } from 'next/navigation';
import React from 'react';
export default async function layout({ children }: { children: React.ReactNode }) {
  const supabase = await createAppServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <Header user={user} />
      <section className="mt-11 flex-1 px-2">{children}</section>
    </div>
  );
}
