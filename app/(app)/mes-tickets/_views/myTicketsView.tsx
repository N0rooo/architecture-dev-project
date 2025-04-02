'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useCountdown } from '@/context/countdownProvider';
import { useMyTickets } from '@/context/myTicketsProvider';
import { Calendar, Clock, Eye, EyeOff, Filter, Gift, HandCoins, Search, Ticket } from 'lucide-react';
import { useState } from 'react';

export default function MyTicketsView() {
  const { tickets, loading } = useMyTickets();
  const { countdown, formatTime } = useCountdown();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'revealed', 'unrevealed'

  // Filtrer les tickets en fonction de la recherche et du filtre
  const filteredTickets = tickets
    ? tickets.filter((ticket) => {
        const matchesSearch = ticket.prize.prize_name.toLowerCase().includes(search.toLowerCase());
        const matchesFilter =
          filter === 'all' ||
          (filter === 'revealed' && ticket.is_revealed) ||
          (filter === 'unrevealed' && !ticket.is_revealed);
        return matchesSearch && matchesFilter;
      })
    : [];

  // Calculer les statistiques
  const totalTickets = tickets?.length || 0;
  const revealedTickets = tickets?.filter(t => t.is_revealed).length || 0;
  const unrevealedTickets = tickets?.filter(t => !t.is_revealed).length || 0;
  const totalValue = tickets
    ?.filter(t => t.is_revealed)
    .reduce((sum, ticket) => sum + (ticket.prize.prize_amount || 0), 0) || 0;

  // Formatter la date
  const formatDate = (dateString: string | null | undefined): string => {
    const date = new Date(dateString || '');
    return date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto max-w-7xl py-10">
        <div className="mb-8 flex items-center justify-between">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-12 w-32" />
        </div>

        <div className="mb-6 flex items-center gap-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header with title and stats summary */}
      <div className="mb-8 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Mes Tickets</h1>
          <p className="mt-2 text-slate-500">
            Retrouvez tous vos tickets et suivez vos gains
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-50 to-indigo-50 p-4 shadow-sm">
          <HandCoins className="h-6 w-6 text-purple-500" />
          <div className="flex flex-col">
            <span className="text-sm text-slate-500">Total points gagnés</span>
            <span className="text-xl font-bold text-purple-700">{totalValue.toFixed(2)} points</span>
          </div>
        </div>
      </div>

      {/* Statistics cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        <Card className="bg-gradient-to-r from-slate-50 to-slate-100 shadow-sm">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-full bg-slate-200 p-2">
              <Ticket className="h-5 w-5 text-slate-700" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total tickets</p>
              <p className="text-xl font-bold text-slate-800">{totalTickets}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 shadow-sm">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-full bg-green-100 p-2">
              <Eye className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Tickets révélés</p>
              <p className="text-xl font-bold text-green-700">{revealedTickets}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 shadow-sm">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-full bg-amber-100 p-2">
              <EyeOff className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">À révéler</p>
              <p className="text-xl font-bold text-amber-700">{unrevealedTickets}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-blue-50 to-sky-50 shadow-sm">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-full bg-blue-100 p-2">
              <Gift className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Prochain ticket</p>
              <p className="text-xl font-bold text-blue-700">
                {countdown !== null ? formatTime(countdown) : '--:--:--'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and filter toolbar */}
      <div className="mb-8 flex flex-col gap-4 rounded-xl bg-slate-50 p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            className="pl-10 bg-white"
            placeholder="Rechercher un ticket..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500">Filtrer par:</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                {filter === 'all' && 'Tous les tickets'}
                {filter === 'revealed' && 'Tickets révélés'}
                {filter === 'unrevealed' && 'Tickets non révélés'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilter('all')}>Tous les tickets</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('revealed')}>Tickets révélés</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('unrevealed')}>Tickets non révélés</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Tickets grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {filteredTickets?.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-slate-100 p-6">
              <HandCoins className="h-12 w-12 text-slate-400" />
            </div>
            <p className="mt-6 text-xl font-semibold text-slate-700">Aucun ticket trouvé</p>
            <p className="mt-2 text-sm text-slate-500">
              {search || filter !== 'all' 
                ? "Essayez de modifier vos critères de recherche ou de filtre"
                : "Commencez par obtenir des tickets gratuits ou premium"}
            </p>
            {(search || filter !== 'all') && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearch('');
                  setFilter('all');
                }}
              >
                Réinitialiser les filtres
              </Button>
            )}
          </div>
        ) : (
          filteredTickets.map((ticket) => (
            <Card
              key={ticket.id}
              className={`${
                ticket.is_revealed 
                  ? 'bg-gradient-to-r from-slate-50 to-slate-100' 
                  : 'bg-gradient-to-r from-amber-50 to-yellow-50'
              } overflow-hidden shadow-md hover:shadow-lg transition-all`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`rounded-full p-2 ${
                      ticket.is_revealed ? 'bg-slate-200' : 'bg-amber-100'
                    }`}>
                      {ticket.is_revealed ? (
                        <Eye className="h-4 w-4 text-slate-600" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-amber-600" />
                      )}
                    </div>
                    <CardTitle className="text-lg font-bold text-slate-800">{ticket.prize.prize_name}</CardTitle>
                  </div>
                  <Badge
                    variant={ticket.is_revealed ? 'secondary' : 'default'}
                    className={
                      ticket.is_revealed
                        ? 'bg-slate-200 text-slate-700'
                        : 'bg-amber-100 text-amber-700'
                    }
                  >
                    {ticket.is_revealed ? 'Révélé' : 'Non révélé'}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pb-0">
                {ticket.is_revealed ? (
                  <div className="flex flex-col items-center gap-3 py-4">
                    <div className="rounded-full bg-purple-100 p-4">
                      <HandCoins className="h-8 w-8 text-purple-500" />
                    </div>
                    <div className="bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-3xl font-bold text-transparent">
                      {ticket.prize.prize_amount?.toFixed(2)} points
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 py-8">
                    <div className="rounded-full bg-amber-100 p-5">
                      <Gift className="h-10 w-10 text-amber-500 animate-pulse" />
                    </div>
                    <p className="text-center text-amber-700">
                      Ce ticket contient une surprise !<br />Révélez-le pour voir votre gain.
                    </p>
                    <Button variant="outline" className="mt-2">
                      Révéler maintenant
                    </Button>
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="flex items-center justify-between border-t border-slate-200 bg-white bg-opacity-50 px-4 py-3 text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(ticket.attempted_at)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>ID: {String(ticket.id).substring(0, 8)}</span>
                </div>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}