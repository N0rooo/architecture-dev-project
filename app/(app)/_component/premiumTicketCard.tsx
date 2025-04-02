'use client';
import {
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { useMyTickets } from '@/context/myTicketsProvider';
import { useProfile } from '@/context/profileProvider';
import { PremiumTicket } from '@/data/tickets';
import { Ticket } from '@/types/types';
import { Sparkles, Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

export default function PremiumTicketCard({
  ticket,
  userPoints,
}: {
  ticket: PremiumTicket;
  userPoints: number;
}) {
  const [dialogOpen, setDialogOpen] = useState<Record<number, boolean>>({});
  const [isBuyingTicket, setIsBuyingTicket] = useState(false);

  const { removePointsOnClientSide } = useProfile();
  const { refreshTickets } = useMyTickets();
  const handleDialogToggle = (ticketId: number) => {
    setDialogOpen((prev) => ({ ...prev, [ticketId]: !prev[ticketId] }));
  };

  const handleBuyTicket = async (ticketId: number, price: number) => {
    setIsBuyingTicket(true);
    try {
      const response = await fetch(`/api/prize/buy-ticket`, {
        method: 'POST',
        body: JSON.stringify({ ticketId }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Ticket acheté avec succès', {
          description: "Retrouvez votre ticket dans la section 'Mes tickets'",
        });
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
  return (
    <Card key={ticket.id} className={`${ticket.color} transition-all hover:shadow-lg`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className={`${ticket.textColor} text-xl`}>{ticket.name}</CardTitle>
          <Sparkles className={`${ticket.textColor} h-5 w-5`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <div
            className={`flex items-center justify-center gap-2 text-xl font-bold ${ticket.textColor}`}
          >
            {ticket.price} points
          </div>
          <p className="mt-2 text-center text-sm">
            Gagnez entre {ticket.minReward} et {ticket.maxReward ?? '???'} points
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <AlertDialog
          open={dialogOpen[ticket.id] || false}
          onOpenChange={() => handleDialogToggle(ticket.id)}
        >
          <AlertDialogTrigger asChild>
            <Button
              className="w-full"
              disabled={(userPoints ?? 0) < ticket.price}
              variant="default"
            >
              {(userPoints ?? 0) >= ticket.price ? 'Acheter & Gratter' : 'Points insuffisants'}
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
                {isBuyingTicket && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isBuyingTicket ? 'Achat en cours...' : `Acheter pour ${ticket.price} points`}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
