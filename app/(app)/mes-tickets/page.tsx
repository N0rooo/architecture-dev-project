import React from 'react';
import MyTicketsView from './_views/myTicketsView';
import { MyTicketsProvider } from '@/context/myTicketsProvider';

export default function page() {
  return (
    <section className="mt-4 flex flex-col items-center justify-center gap-4">
      <div className="flex items-center justify-center">
        <MyTicketsView />
      </div>
    </section>
  );
}
