'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Eye, EyeOff, HandCoins } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { useMyTickets } from '@/context/myTicketsProvider';

export default function MyTicketsView() {
  const { tickets, loading } = useMyTickets();
  const [search, setSearch] = useState('');

  const filteredTickets = tickets ?? [];

  if (loading) {
    return (
      <div className="container mx-auto max-w-7xl py-10">
        <div className="mb-8 flex items-center justify-between">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-12 w-32" />
        </div>

        <div className="mb-6 flex items-center">
          <Skeleton className="h-10 w-64" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="bg-slate-50">
              <CardHeader>
                <Skeleton className="h-6 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="mb-2 h-8 w-full" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mes Tickets</h1>
          <p className="text-muted-foreground mt-2">
            Retrouvez tous vos tickets et leurs récompenses
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-50 to-yellow-50 p-4 shadow-sm">
          <HandCoins className="h-6 w-6 text-yellow-500" />
          <div className="flex flex-col">
            <span className="text-muted-foreground text-sm">Total tickets</span>
            <span className="text-xl font-bold">{tickets?.length ?? 0}</span>
          </div>
        </div>
      </div>

      <div className="mb-8 rounded-xl bg-slate-50 p-6">
        <Input
          className="max-w-xs bg-white"
          placeholder="Rechercher un ticket..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {filteredTickets?.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
            <HandCoins className="text-muted-foreground mb-4 h-12 w-12" />
            <p className="text-muted-foreground text-xl font-semibold">Aucun ticket trouvé</p>
            <p className="text-muted-foreground mt-2 text-sm">
              Commencez par obtenir des tickets gratuits ou premium
            </p>
          </div>
        ) : (
          filteredTickets.map((ticket) => (
            <Card
              key={ticket.id}
              className={` ${ticket.is_revealed ? 'bg-gradient-to-r from-slate-50 to-slate-100' : 'bg-gradient-to-r from-amber-50 to-yellow-50'} border-none transition-all hover:shadow-lg`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold">{ticket.prize.prize_name}</CardTitle>
                  <Badge
                    variant={ticket.is_revealed ? 'secondary' : 'default'}
                    className={
                      ticket.is_revealed
                        ? 'bg-slate-200 text-slate-700'
                        : 'bg-amber-100 text-amber-700'
                    }
                  >
                    {ticket.is_revealed ? (
                      <Eye className="mr-1 h-3 w-3" />
                    ) : (
                      <EyeOff className="mr-1 h-3 w-3" />
                    )}
                    {ticket.is_revealed ? 'Révélé' : 'Non révélé'}
                  </Badge>
                </div>
              </CardHeader>
              {ticket.is_revealed && (
                <CardContent>
                  <div className="flex flex-col items-center gap-3">
                    <div className="rounded-full bg-white p-4 shadow-sm">
                      <HandCoins className="h-8 w-8 text-yellow-500" />
                    </div>
                    <div className="bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-3xl font-bold text-transparent">
                      {ticket.prize.prize_amount?.toFixed(2)}€
                    </div>
                    <p className="text-muted-foreground text-sm">
                      Obtenu le {new Date(ticket.attempted_at ?? '').toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
