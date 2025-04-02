import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useCountdown } from '@/context/countdownProvider';
import { Clock, Gift } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function countDownPart() {
  const { countdown, formatTime } = useCountdown();
  const router = useRouter();
  const timeToNextTicket = countdown ? Math.floor(countdown / 60) % 60 : 0;

  return (
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
            router.push('/ticket-gratuit');
          }
        }}
      >
        {timeToNextTicket > 0 ? 'Disponible bientôt' : 'Récupérer ticket gratuit'}
      </Button>
    </div>
  );
}
