'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useCountdown } from '@/context/countdownProvider';
import { useMyTickets } from '@/context/myTicketsProvider';
import {
  Calendar,
  Clock,
  Eye,
  EyeOff,
  Filter,
  Gift,
  HandCoins,
  Search,
  Ticket,
  Sparkles,
} from 'lucide-react';
import { useState } from 'react';

// Utilisation des couleurs existantes des tickets premium
import { premiumTickets } from '@/data/tickets';

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
  const revealedTickets = tickets?.filter((t) => t.is_revealed).length || 0;
  const unrevealedTickets = tickets?.filter((t) => !t.is_revealed).length || 0;
  const totalValue =
    tickets
      ?.filter((t) => t.is_revealed)
      .reduce((sum, ticket) => sum + (ticket.prize.prize_amount || 0), 0) || 0;

  // Formatter la date
  const formatDate = (dateString: string | null | undefined): string => {
    const date = new Date(dateString || '');
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Attribuer des couleurs issues de premiumTickets à chaque ticket
  const getTicketStyle = (id: string | number, isRevealed: boolean) => {
    if (!isRevealed) {
      // Toujours utiliser la couleur Or pour les tickets non révélés
      return {
        color: premiumTickets[1].color, // Or
        textColor: premiumTickets[1].textColor,
        buttonBg: 'bg-amber-600 hover:bg-amber-700'
      };
    }
    
    // Pour les tickets révélés, choisir une couleur basée sur l'ID
    const stringId = String(id);
    const seed = stringId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const index = seed % premiumTickets.length;
    
    const ticketStyle = premiumTickets[index];
    let buttonBg = 'bg-slate-600 hover:bg-slate-700';
    
    switch(index) {
      case 0: // Argent
        buttonBg = 'bg-slate-600 hover:bg-slate-700';
        break;
      case 1: // Or
        buttonBg = 'bg-amber-600 hover:bg-amber-700';
        break;
      case 2: // Platine
        buttonBg = 'bg-cyan-600 hover:bg-cyan-700';
        break;
      case 3: // Mystère
        buttonBg = 'bg-purple-600 hover:bg-purple-700';
        break;
    }
    
    return {
      color: ticketStyle.color,
      textColor: ticketStyle.textColor,
      buttonBg: buttonBg
    };
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
    <div className="container mx-auto max-w-7xl py-10">
      {/* Header with title and stats summary */}
      <div className="mb-8 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Mes Tickets</h1>
          <p className="mt-2 text-slate-500">Retrouvez tous vos tickets et suivez vos gains</p>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-slate-100 p-3">
          <HandCoins className="text-yellow-500" />
          <span className="font-semibold">{totalValue.toFixed(0)} points</span>
        </div>
      </div>

      {/* Statistics cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        <Card className={`${premiumTickets[0].color} shadow-sm`}>
          <CardHeader className="pb-2">
            <CardTitle className={`text-sm ${premiumTickets[0].textColor}`}>Total tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Ticket className={premiumTickets[0].textColor} />
              <span className="text-2xl font-bold">{totalTickets}</span>
            </div>
          </CardContent>
        </Card>

        <Card className={`${premiumTickets[2].color} shadow-sm`}>
          <CardHeader className="pb-2">
            <CardTitle className={`text-sm ${premiumTickets[2].textColor}`}>Tickets révélés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Eye className={premiumTickets[2].textColor} />
              <span className="text-2xl font-bold">{revealedTickets}</span>
            </div>
          </CardContent>
        </Card>

        <Card className={`${premiumTickets[1].color} shadow-sm`}>
          <CardHeader className="pb-2">
            <CardTitle className={`text-sm ${premiumTickets[1].textColor}`}>À révéler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <EyeOff className={premiumTickets[1].textColor} />
              <span className="text-2xl font-bold">{unrevealedTickets}</span>
            </div>
          </CardContent>
        </Card>

        <Card className={`${premiumTickets[3].color} shadow-sm`}>
          <CardHeader className="pb-2">
            <CardTitle className={`text-sm ${premiumTickets[3].textColor}`}>Prochain ticket</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Gift className={premiumTickets[3].textColor} />
              <span className="text-2xl font-bold">
                {countdown !== null ? formatTime(countdown) : '--:--:--'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and filter toolbar */}
      <div className="mb-8 flex flex-col gap-4 rounded-xl bg-slate-50 p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-xs">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            className="bg-white pl-10"
            placeholder="Rechercher un ticket..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500">Filtrer par:</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="gap-2" variant="outline">
                <Filter className="h-4 w-4" />
                {filter === 'all' && 'Tous les tickets'}
                {filter === 'revealed' && 'Tickets révélés'}
                {filter === 'unrevealed' && 'Tickets non révélés'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilter('all')}>Tous les tickets</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('revealed')}>
                Tickets révélés
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('unrevealed')}>
                Tickets non révélés
              </DropdownMenuItem>
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
                ? 'Essayez de modifier vos critères de recherche ou de filtre'
                : 'Commencez par obtenir des tickets gratuits ou premium'}
            </p>
            {(search || filter !== 'all') && (
              <Button
                className="mt-4"
                variant="outline"
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
          filteredTickets.map((ticket) => {
            const ticketStyle = getTicketStyle(ticket.id, ticket.is_revealed);
            
            return (
              <Card
                key={ticket.id}
                className={`${ticketStyle.color} transition-all hover:shadow-lg`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className={`${ticketStyle.textColor} text-xl`}>
                      {ticket.prize.prize_name}
                    </CardTitle>
                    {ticket.is_revealed ? (
                      <Eye className={`${ticketStyle.textColor} h-5 w-5`} />
                    ) : (
                      <Sparkles className={`${ticketStyle.textColor} h-5 w-5`} />
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  {ticket.is_revealed ? (
                    <div className="flex flex-col gap-2">
                      <div className={`flex items-center justify-center gap-2 text-xl font-bold ${ticketStyle.textColor}`}>
                        {ticket.prize.prize_amount?.toFixed(2)} points
                      </div>
                      <p className="mt-2 text-center text-sm text-slate-600">
                        Obtenu le {formatDate(ticket.attempted_at)}
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3 py-4">
                      <div className={`rounded-full p-4 ${ticketStyle.color}`}>
                        <Gift className={`h-8 w-8 ${ticketStyle.textColor} animate-pulse`} />
                      </div>
                      <p className="text-center text-sm">
                        Ce ticket contient une surprise !<br />
                        Révélez-le pour voir votre gain.
                      </p>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="flex justify-center">
                  {!ticket.is_revealed && (
                    <Button
                      className={`w-full ${ticketStyle.buttonBg}`}
                      variant="default"
                    >
                      Révéler maintenant
                    </Button>
                  )}
                  {ticket.is_revealed && (
                    <div className="flex w-full items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(ticket.attempted_at)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>ID: {ticket.id.toString().substring(0, 8)}</span>
                      </div>
                    </div>
                  )}
                </CardFooter>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}