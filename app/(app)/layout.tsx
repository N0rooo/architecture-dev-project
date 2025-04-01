import { Header } from '@/components/head/header';
import { createAppServerClient } from '@/supabase/server';
import React from 'react';
import { redirect } from 'next/navigation';
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
      <section className="flex-1 mt-11">{children}</section>
    </div>
  );
}
