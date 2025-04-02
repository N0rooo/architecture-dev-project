'use client';

import { Profile, TicketWithPrize } from '@/types/types';
import { User } from '@supabase/supabase-js';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

type MyTicketsContextType = {
  tickets: TicketWithPrize[] | null;
  setTickets: (value: TicketWithPrize[] | null) => void;
  loading: boolean;
};

const MyTicketsContext = createContext<MyTicketsContextType | undefined>(undefined);

export function MyTicketsProvider({ children }: { children: ReactNode }) {
  const [tickets, setTickets] = useState<TicketWithPrize[] | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchTickets = async () => {
      const response = await fetch('/api/tickets');
      if (!response.ok) {
        throw new Error('Failed to fetch tickets');
      }
      const data = await response.json();
      setTickets(data);
      setLoading(false);
    };
    fetchTickets();
  }, []);

  return (
    <MyTicketsContext.Provider value={{ tickets, setTickets, loading }}>
      {children}
    </MyTicketsContext.Provider>
  );
}

export function useMyTickets() {
  const context = useContext(MyTicketsContext);
  if (context === undefined) {
    throw new Error('useMyTickets must be used within a MyTicketsProvider');
  }
  return context;
}
