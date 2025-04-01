'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useCountdown } from '@/context/countdownProvider';
import { cn } from '@/lib/utils';
import { Clock, Coins, Gift, HandCoins } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function HomeView() {
  const { countdown, formatTime } = useCountdown();
  const router = useRouter();
  const timeToNextTicket = countdown ? Math.floor(countdown / 60) % 60 : 100;
  const userPoints = 350;

  const tickets = [
    {
      name: 'Basique',
      price: 0,
      color: 'bg-gray-100',
      textColor: 'text-gray-700',
      minReward: 20,
      maxReward: 100,
      isTimeLimited: true,
      available: false,
    },
    {
      name: 'Standard',
      price: 100,
      color: 'bg-blue-100',
      textColor: 'text-blue-700',
      minReward: 40,
      maxReward: 200,
      isTimeLimited: false,
    },
    {
      name: 'Premium',
      price: 200,
      color: 'bg-purple-100',
      textColor: 'text-purple-700',
      minReward: 80,
      maxReward: 400,
      isTimeLimited: false,
    },
    {
      name: 'Élite',
      price: 350,
      color: 'bg-amber-100',
      textColor: 'text-amber-700',
      minReward: 150,
      maxReward: 750,
      isTimeLimited: false,
    },
    {
      name: 'Légendaire',
      price: 500,
      color: 'bg-rose-100',
      textColor: 'text-rose-700',
      minReward: 200,
      maxReward: 1500,
      isTimeLimited: false,
    },
  ];

  return (
    <div className="container mx-auto mt-11 max-w-4xl py-10">
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

      <h2 className="mb-4 text-xl font-semibold">Tickets Premium</h2>
      <p className="mb-6 text-sm text-slate-600">
        Utilisez vos points pour acheter des tickets avec de meilleures récompenses
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
        {tickets.slice(1).map((ticket, index) => (
          <Card
            key={index}
            className={cn('min-w-72 border-0 transition-all hover:shadow-lg', ticket.color)}
          >
            <CardHeader className="gap-0">
              <CardTitle className={cn('text-xl', ticket.textColor)}>{ticket.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-3 flex items-center justify-center gap-2">
                <div className={cn('flex items-center gap-2 text-2xl font-bold', ticket.textColor)}>
                  <Coins size={24} />
                  {ticket.price} points
                </div>
              </div>
              <p className="text-center text-sm">
                Gagnez entre {ticket.minReward} et {ticket.maxReward} points
              </p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button
                disabled={userPoints < ticket.price}
                variant={userPoints >= ticket.price ? 'default' : 'outline'}
                className={cn(
                  'w-full text-sm font-semibold',
                  userPoints >= ticket.price ? 'cursor-pointer text-white' : 'text-gray-500',
                )}
              >
                {userPoints >= ticket.price ? 'Acheter et gratter' : 'Points insuffisants'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-10 rounded-xl bg-slate-50 p-6">
        <h2 className="mb-4 text-xl font-semibold">Comment ça marche</h2>
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <span className="font-bold text-green-500">1.</span> Récupérez votre ticket basique
            gratuit chaque heure
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-green-500">2.</span> Grattez votre ticket pour gagner
            des points
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-green-500">3.</span> Utilisez vos points pour acheter
            des tickets premium
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-green-500">4.</span> Les tickets plus chers offrent de
            meilleures récompenses
          </li>
        </ul>
      </div>
    </div>
  );
}
