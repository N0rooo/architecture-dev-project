'use client';

import HowItWorks from '@/components/HowItWorks';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useCountdown } from '@/context/countdownProvider';
import { Clock, Gift, HandCoins, Loader2, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Profile } from '@/types/types';
import { useProfile } from '@/context/profileProvider';
import { premiumTickets } from '@/data/tickets';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';
import { toast } from 'sonner';
import CountDownPart from '../_component/countDownPart';
import { useMyTickets } from '@/context/myTicketsProvider';

export default function HomeView({ user }: { user: Profile }) {
  const { profile, loading, removePointsOnClientSide } = useProfile();
  const [isBuyingTicket, setIsBuyingTicket] = useState(false);
  const [dialogOpen, setDialogOpen] = useState<Record<number, boolean>>({});

  const { refreshTickets } = useMyTickets();

  const userPoints = profile?.points;

  const handleBuyTicket = async (ticketId: number, price: number) => {
    console.log('handleBuyTicket', ticketId, price);
    setIsBuyingTicket(true);
    try {
      const response = await fetch(`/api/prize/buy-ticket`, {
        method: 'POST',
        body: JSON.stringify({ ticketId }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Ticket acheté avec succès');
        removePointsOnClientSide(price);
        handleDialogToggle(ticketId);
        refreshTickets();
      } else {
        toast.error("Erreur lors de l'achat du ticket");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsBuyingTicket(false);
    }
  };

  const handleDialogToggle = (ticketId: number) => {
    setDialogOpen((prev: Record<number, boolean>) => ({ ...prev, [ticketId]: !prev[ticketId] }));
  };

  if (loading) {
    return (
      <div className="container mx-auto max-w-4xl py-10">
        <div className="mb-8 flex items-center justify-between">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-12 w-32" />
        </div>

        <div className="mb-8 rounded-xl bg-slate-50 p-6">
          <Skeleton className="mb-4 h-6 w-36" />
          <Skeleton className="mb-3 h-4 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>

        <div className="mt-6">
          <div className="m-4">
            <Skeleton className="mb-2 h-8 w-48" />
            <Skeleton className="h-4 w-96" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="bg-slate-50">
                <CardHeader>
                  <Skeleton className="h-6 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="mb-2 h-8 w-full" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-10">
      {/* <div className="container mx-auto max-w-7xl py-10"></div> */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tickets à Gratter</h1>
        <div className="flex items-center gap-2 rounded-lg bg-slate-100 p-3">
          <HandCoins className="text-yellow-500" />
          <span className="font-semibold">{userPoints} points</span>
        </div>
      </div>

      <CountDownPart />

      <div className="mt-6">
        <div className="m-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Tickets Premium</h2>
            <p className="text-muted-foreground">
              Utilisez vos points pour acheter des tickets premium avec des récompenses plus élevées
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {premiumTickets.map((ticket, index) => (
            <Card key={index} className={`${ticket.color} transition-all hover:shadow-lg`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className={`${ticket.textColor} text-xl`}>{ticket.name}</CardTitle>
                  <Sparkles className={`${ticket.textColor} h-5 w-5`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <div
                    className={`text-xl font-bold ${ticket.textColor} flex items-center justify-center gap-2`}
                  >
                    {ticket.price} points
                  </div>
                  <p className="mt-2 text-center text-sm">
                    Gagnez entre {ticket.minReward} et {ticket.maxReward} points
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <AlertDialog
                  open={dialogOpen[ticket.id] || false}
                  onOpenChange={() => handleDialogToggle(ticket.id)}
                >
                  <AlertDialogTrigger asChild>
                    <Button disabled={(userPoints ?? 0) < ticket.price}>
                      {(userPoints ?? 0) >= ticket.price
                        ? 'Acheter & Gratter'
                        : 'Points insuffisants'}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Voulez-vous vraiment acheter ce ticket ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Cela vous coûtera {ticket.price} points.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <Button
                        disabled={isBuyingTicket}
                        onClick={() => handleBuyTicket(ticket.id, ticket.price)}
                      >
                        {isBuyingTicket && (
                          <>
                            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                          </>
                        )}
                        {isBuyingTicket
                          ? 'Achat en cours...'
                          : `Acheter pour ${ticket.price} points`}
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <HowItWorks />
    </div>
  );
}
