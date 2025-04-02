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
  X,
} from 'lucide-react';
import { useState } from 'react';
import CountDownCase from '../_component/countDownCase';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { TicketWithPrize } from '@/types/types';
import { ScratchToReveal } from '@/components/magicui/scratch-to-reveal';

export default function MyTicketsView() {
  const { tickets, loading, refreshTickets } = useMyTickets();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'revealed', 'unrevealed'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [revealLoadingId, setRevealLoadingId] = useState<number | null>(null);
  const [revealedTicket, setRevealedTicket] = useState<TicketWithPrize | null>(null);
  const [error, setError] = useState('');
  const [revealed, setRevealed] = useState(false);

  // Filtrer les tickets en fonction de la recherche et du filtre
  const filteredTickets = tickets
    ? tickets.filter((ticket) => {
        const matchesSearch = ticket.is_revealed
          ? ticket.prize.prize_name.toLowerCase().includes(search.toLowerCase())
          : 'Non révélé'.toLowerCase().includes(search.toLowerCase());
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
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Fonction pour révéler un ticket
  const handleRevealTicket = async (ticketId: number) => {
    try {
      setRevealLoadingId(ticketId);
      setError('');

      // Appel API pour révéler le ticket
      const response = await fetch(`/api/prize/reveal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ attemptId: ticketId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la révélation du ticket');
      }

      // Mise à jour des données et ouverture du modal
      setRevealedTicket(tickets?.find((t) => t.id === ticketId) ?? null);
      setIsModalOpen(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Une erreur est survenue lors de la révélation du ticket',
      );
      console.error('Erreur de révélation:', err);
    } finally {
      setRevealLoadingId(null);
    }
  };

  const handleScratchComplete = () => {
    refreshTickets();
    setRevealed(true);
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
    console.log({ revealedTicket }),
    (
      <div className="w-full">
        {/* Header with title and stats summary */}
        <div className="mb-8 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Mes Tickets</h1>
            <p className="mt-2 text-slate-500">Retrouvez tous vos tickets et suivez vos gains</p>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-50 to-indigo-50 p-4 shadow-sm">
            <HandCoins className="h-6 w-6 text-purple-500" />
            <div className="flex flex-col">
              <span className="text-sm text-slate-500">Total points gagnés</span>
              <span className="text-xl font-bold text-purple-700">
                {totalValue.toFixed(2)} points
              </span>
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
              <CountDownCase />
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
                <DropdownMenuItem onClick={() => setFilter('all')}>
                  Tous les tickets
                </DropdownMenuItem>
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
              return (
                <Card
                  key={ticket.id}
                  className={`${
                    ticket.is_revealed
                      ? 'bg-gradient-to-r from-slate-50 to-slate-100'
                      : 'bg-gradient-to-r from-amber-50 to-yellow-50'
                  } overflow-hidden shadow-md transition-all hover:shadow-lg`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`rounded-full p-2 ${
                            ticket.is_revealed ? 'bg-slate-200' : 'bg-amber-100'
                          }`}
                        >
                          {ticket.is_revealed ? (
                            <Eye className="h-4 w-4 text-slate-600" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-amber-600" />
                          )}
                        </div>
                        <CardTitle className="text-lg font-bold text-slate-800">
                          {ticket.is_revealed ? ticket.prize.prize_name : ''}
                        </CardTitle>
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
                          <Gift className="h-10 w-10 animate-pulse text-amber-500" />
                        </div>
                        <p className="text-center text-amber-700">
                          Ce ticket contient une surprise !<br />
                          Révélez-le pour voir votre gain.
                        </p>
                        <Button
                          className="mt-2"
                          disabled={revealLoadingId === ticket.id}
                          variant="outline"
                          onClick={() => handleRevealTicket(ticket.id)}
                        >
                          {revealLoadingId === ticket.id ? 'Chargement...' : 'Révéler maintenant'}
                        </Button>
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="bg-opacity-50 flex items-center justify-between border-t border-slate-200 bg-white px-4 py-3 text-xs text-slate-500">
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
              );
            })
          )}
        </div>

        {/* Modal de révélation */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="">
            <DialogHeader>
              <DialogClose className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none">
                <X className="h-4 w-4" />
                <span className="sr-only">Fermer</span>
              </DialogClose>
            </DialogHeader>

            {error ? (
              <div className="flex flex-col items-center justify-center py-6">
                <div className="rounded-full bg-red-100 p-4">
                  <X className="h-8 w-8 text-red-500" />
                </div>
                <DialogDescription className="mt-4 text-center">{error}</DialogDescription>
                <Button className="mt-6" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Fermer
                </Button>
              </div>
            ) : (
              revealedTicket && (
                <ScratchToReveal
                  className="flex items-center justify-center overflow-hidden rounded-2xl border-2 bg-gray-100 shadow-lg"
                  gradientColors={['#A97CF8', '#F38CB8', '#FDCC92']}
                  height={450}
                  minScratchPercentage={30}
                  width={450}
                  onComplete={handleScratchComplete}
                >
                  <div className="flex flex-col items-center justify-center p-4 text-center">
                    <h2 className="mb-2 text-3xl font-bold">Félicitations !</h2>
                    <p className="mb-4 text-xl">Vous avez gagné :</p>
                    <div className="text-primary mb-2 text-5xl font-bold">
                      {revealedTicket.prize.prize_amount?.toFixed(2)} points
                    </div>
                    <p className="text-lg">{revealedTicket.prize.prize_name || 'Prix'}</p>
                    {revealed && (
                      <Button
                        className="mt-6 cursor-pointer"
                        variant="outline"
                        onClick={() => {
                          setIsModalOpen(false);
                          setRevealedTicket(null);
                          setRevealed(false);
                        }}
                      >
                        Collecter & Continuer
                      </Button>
                    )}
                  </div>
                </ScratchToReveal>
              )
            )}
          </DialogContent>
        </Dialog>
      </div>
    )
  );
}
