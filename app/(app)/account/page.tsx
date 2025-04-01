'use client';
import HowItWorks from '@/components/HowItWorks';
import { ScratchToReveal } from '@/components/magicui/scratch-to-reveal';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useCountdown } from '@/context/countdownProvider';
import type { CashPrize } from '@/types/types';
import {
  Award,
  Calendar,
  Clock,
  Gift,
  Loader2,
  Star,
  TrendingUp,
  Trophy,
  User,
  Wallet,
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AccountPage() {
  const [prize, setPrize] = useState<Omit<
    CashPrize,
    'created_at' | 'updated_at' | 'is_active' | 'probability'
  > | null>(null);
  const [loading, setLoading] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  const { countdown, formatTime, startCountdown } = useCountdown();

  const user = {
    name: 'Thomas Dupont',
    email: 'thomas.dupont@exemple.fr',
    avatar: '',
    memberSince: '15 janvier 2025',
    level: 7,
    pointsBalance: 1250,
    vip: true,
  };

  const [userStats,] = useState({
    totalWon: 2350,
    scratched: 48,
    biggestWin: 500,
    currentStreak: 7,
  });

  const prizeHistory = [
    { date: '30/03/2025', amount: 75, name: 'Prix Argent' },
    { date: '29/03/2025', amount: 120, name: 'Prix Or' },
    { date: '28/03/2025', amount: 50, name: 'Prix Bronze' },
    { date: '27/03/2025', amount: 500, name: 'Prix Platine' },
    { date: '26/03/2025', amount: 25, name: 'Prix Bronze' },
  ];

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

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <Card className="mt-4 md:mt-0 md:w-80">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Avatar className="border-primary h-14 w-14 border-2">
                <AvatarImage alt={user.name} src={user.avatar} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{user.name}</p>
                  {user.vip && <Badge className="bg-amber-500">VIP</Badge>}
                </div>
                <div className="text-muted-foreground flex items-center gap-1 text-xs">
                  <User className="h-3 w-3" />
                  <span>Niveau {user.level}</span>
                </div>
                <div className="mt-1 flex items-center gap-1 text-sm">
                  <Wallet className="h-4 w-4 text-green-500" />
                  <span className="font-medium">{user.pointsBalance} points</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Gagné</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="text-green-500" />
              <span className="text-2xl font-bold">{userStats.totalWon}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Tickets Grattés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Gift className="text-purple-500" />
              <span className="text-2xl font-bold">{userStats.scratched}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Plus Gros Gain</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Trophy className="text-amber-500" />
              <span className="text-2xl font-bold">{userStats.biggestWin}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Série Actuelle</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Award className="text-blue-500" />
              <span className="text-2xl font-bold">{userStats.currentStreak} jours</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Ticket Gratuit Quotidien</CardTitle>
                <CardDescription>
                  Grattez votre ticket gratuit chaque jour pour gagner des points
                </CardDescription>
              </div>
              <Badge className="gap-1" variant="outline">
                <Calendar className="h-3 w-3" /> Quotidien
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            {countdown !== null && countdown > 0 && (
              <div className="mb-4 w-full">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">
                    Prochain ticket disponible dans:
                  </span>
                  <Badge className="flex items-center gap-1" variant="outline">
                    <Clock className="h-3 w-3" />
                    <span>{formatTime(countdown)}</span>
                  </Badge>
                </div>
                <Progress className="h-2" value={Math.max(0, 100 - (countdown / 3600) * 100)} />
              </div>
            )}

            {!prize && !countdown && isPageLoaded && (
              <Button
                className="mt-4 text-lg"
                disabled={loading || (countdown !== null && countdown > 0)}
                size="lg"
                onClick={generatePrize}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Génération du prix...
                  </>
                ) : countdown !== null && countdown > 0 ? (
                  'Attendez le prochain ticket'
                ) : (
                  'Récupérer Votre Ticket Gratuit'
                )}
              </Button>
            )}

            {prize && (
              <div className="w-full max-w-md">
                <ScratchToReveal
                  className="flex items-center justify-center overflow-hidden rounded-2xl border-2 bg-gray-100"
                  gradientColors={['#A97CF8', '#F38CB8', '#FDCC92']}
                  height={300}
                  minScratchPercentage={30}
                  width={300}
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
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-4">
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <Star className="h-4 w-4 text-amber-400" />
              <span>Membre depuis: {user.memberSince}</span>
            </div>
          </CardFooter>
        </Card>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Gains Récents</CardTitle>
              <CardDescription>Vos derniers prix</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {prizeHistory.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between border-b pb-2 last:border-0"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-muted-foreground text-xs">{item.date}</p>
                    </div>
                    <span className="font-bold">{item.amount} pts</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline">
                Voir Tout l'Historique
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      <HowItWorks />
    </div>
  );
}
