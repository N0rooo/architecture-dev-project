'use client';

import HowItWorks from '@/components/HowItWorks';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useCountdown } from '@/context/countdownProvider';
import { cn } from '@/lib/utils';
import { Clock, Coins, Gift, HandCoins, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function HomeView() {
  const { countdown, formatTime } = useCountdown();
  const router = useRouter();
  const timeToNextTicket = countdown ? Math.floor(countdown / 60) % 60 : 100;
  const userPoints = 350;

  const premiumTickets = [
    { 
      name: 'Argent', 
      price: 100, 
      minReward: 0,
      maxReward: 200,
      color: 'bg-slate-100',
      textColor: 'text-slate-700'
    },
    { 
      name: 'Or', 
      price: 250, 
      minReward: 50,
      maxReward: 500,
      color: 'bg-amber-100',
      textColor: 'text-amber-700'
    },
    { 
      name: 'Platine', 
      price: 500, 
      minReward: 100,
      maxReward: 1000,
      color: 'bg-cyan-100',
      textColor: 'text-cyan-700'
    }
  ];

  return (
    <div className="container mx-auto max-w-4xl py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tickets à Gratter</h1>
        <div className="flex items-center gap-2 rounded-lg bg-slate-100 p-3">
          <HandCoins className="text-yellow-500" />
          <span className="font-semibold">{userPoints} points</span>
        </div>
      </div>

      <div className="mb-8 rounded-xl bg-slate-50 p-6">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <Gift className="text-green-500" />
            Ticket gratuit
          </h2>
          {countdown !== null && countdown > 0 && (
            <Badge className="flex items-center gap-1" variant="outline">
              <Clock size={14} />
              {formatTime(countdown)}
            </Badge>
          )}
        </div>
        <p className="mb-3 text-sm text-slate-600">
          Vous avez droit à un ticket basique gratuit toutes les heures
        </p>
        <Progress className="mb-3 h-2" value={((60 - timeToNextTicket) / 60) * 100} />
        <Button
          className="mt-2 w-full"
          disabled={timeToNextTicket > 0}
          variant={timeToNextTicket > 0 ? 'outline' : 'default'}
          onClick={() => {
            if (timeToNextTicket <= 0) {
              router.push('/cashprize');
            }
          }}
        >
          {timeToNextTicket > 0 ? 'Disponible bientôt' : 'Récupérer ticket gratuit'}
        </Button>
      </div>

      <div className="mt-6">
        <div className="m-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Tickets Premium</h2>
            <p className="text-muted-foreground">Utilisez vos points pour acheter des tickets premium avec des récompenses plus élevées</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {premiumTickets.map((ticket, index) => (
            <Card key={index} className={`${ticket.color} hover:shadow-lg transition-all`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className={`${ticket.textColor} text-xl`}>{ticket.name}</CardTitle>
                  <Sparkles className={`${ticket.textColor} h-5 w-5`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <div className={`text-xl font-bold ${ticket.textColor} flex items-center gap-2 justify-center`}>
                    {ticket.price} points
                  </div>
                  <p className="text-center text-sm mt-2">
                    Gagnez entre {ticket.minReward} et {ticket.maxReward} points
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button 
                  variant="default"
                  className="w-full"
                  disabled={userPoints < ticket.price}
                >
                  {userPoints >= ticket.price ? "Acheter & Gratter" : "Points insuffisants"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <HowItWorks />
    </div>
  );
}
