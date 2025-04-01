'use client';
import { ScratchToReveal } from '@/components/magicui/scratch-to-reveal';
import type { CashPrize } from '@/types/types';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Clock, Gift, Hourglass, Trophy, Coins } from 'lucide-react';
import { useCountdown } from '@/context/countdownProvider';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

export default function CashprizeView() {
  const [prize, setPrize] = useState<Omit<
    CashPrize,
    'created_at' | 'updated_at' | 'is_active' | 'probability'
  > | null>(null);
  const [loading, setLoading] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  const { countdown, formatTime, startCountdown } = useCountdown();

  useEffect(() => {
    setIsPageLoaded(true);
  }, []);

  const generatePrize = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cashprize');

      if (!res.ok) {
        throw new Error('Échec lors de la récupération du prix');
      }

      const data = await res.json();
      const { success, prize, timeRemaining } = data;
      console.log({ success, prize, timeRemaining });
      setPrize(prize);

      if (timeRemaining) {
        const seconds = timeToSeconds(timeRemaining);
        startCountdown(seconds);
      }
    } catch (error) {
      console.error('Erreur lors de la génération du prix:', error);
    } finally {
      setLoading(false);
    }
  };

  const timeToSeconds = (timeStr: string) => {
    const regex = /(\d+)\s*min\s*(\d+)\s*sec/;
    const match = timeStr.match(regex);

    if (match) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      return minutes * 60 + seconds;
    }
    return 0;
  };

  const handleScratchComplete = () => {
    setRevealed(true);
  };

  // Calculer le pourcentage pour la barre de progression
  const getProgressPercentage = () => {
    if (countdown === null) return 0;
    // Supposons qu'une heure (3600 secondes) est le temps total d'attente
    return Math.max(0, 100 - (countdown / 3600) * 100);
  };

  return (
    <div className="container mx-auto flex max-w-2xl flex-col items-center gap-6 p-6">
      {countdown !== null && countdown > 0 && (
        <Card className="w-full bg-gradient-to-r from-slate-50 to-slate-100 shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold text-slate-800">Prochain ticket</CardTitle>
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                <Clock className="h-3 w-3 mr-1" />
                En attente
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-center my-4">
                <div className="rounded-full bg-purple-100 p-5">
                  <Hourglass className="h-10 w-10 text-purple-500 animate-pulse" />
                </div>
              </div>
              
              <div className="text-center">
                <h3 className="text-2xl font-bold text-slate-800">{formatTime(countdown)}</h3>
                <p className="text-slate-500 text-sm mt-1">avant votre prochain ticket gratuit</p>
              </div>
              
              <div className="mt-2">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>En cours</span>
                  <span>Bientôt disponible</span>
                </div>
                <Progress 
                  value={getProgressPercentage()} 
                  className="h-2 bg-slate-200" 
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-2 pb-4 flex-col gap-2">
            <div className="grid grid-cols-2 gap-4 w-full mt-2">
              <div className="flex items-center bg-slate-100 p-3 rounded-lg">
                <Gift className="h-5 w-5 mr-2 text-amber-500" />
                <div>
                  <p className="text-xs text-slate-500">Type de ticket</p>
                  <p className="text-sm font-medium">Gratuit</p>
                </div>
              </div>
              <div className="flex items-center bg-slate-100 p-3 rounded-lg">
                <Trophy className="h-5 w-5 mr-2 text-amber-500" />
                <div>
                  <p className="text-xs text-slate-500">Récompense max</p>
                  <p className="text-sm font-medium">100 points</p>
                </div>
              </div>
            </div>
            
            <Button
              className="w-full mt-4"
              variant="outline"
              disabled={true}
            >
              <Clock className="mr-2 h-4 w-4" />
              Patientez pour votre prochain ticket
            </Button>
          </CardFooter>
        </Card>
      )}

      {!prize && !countdown && isPageLoaded && (
        <div className="flex w-full flex-col items-center">
          <Card className="mb-4 w-full bg-slate-50 p-4">
            <CardContent className="text-center">
              <p className="mb-3">Vous pouvez obtenir un ticket gratuit toutes les heures pour gagner des points.</p>
              <p className="text-sm text-muted-foreground">Les points gagnés vous permettent d'acheter des tickets premium avec de meilleures récompenses.</p>
            </CardContent>
          </Card>
          
          <Button
            className="text-lg"
            disabled={loading || (countdown !== null && countdown > 0)}
            size="lg"
            onClick={generatePrize}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Génération du ticket...
              </>
            ) : countdown !== null && countdown > 0 ? (
              'Attendez le prochain ticket'
            ) : (
              'Obtenir votre ticket gratuit'
            )}
          </Button>
        </div>
      )}

      {prize && (
        <div className="w-full max-w-md">
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
                {prize.prize_amount.toFixed(2)} points
              </div>
              <p className="text-lg">{prize.prize_name || 'Prix'}</p>
              {revealed && (
                <Button
                  className="mt-6 cursor-pointer"
                  variant="outline"
                  onClick={() => {
                    setPrize(null);
                    setRevealed(false);
                  }}
                >
                  Collecter & Continuer
                </Button>
              )}
            </div>
          </ScratchToReveal>
        </div>
      )}
    </div>
  );
}