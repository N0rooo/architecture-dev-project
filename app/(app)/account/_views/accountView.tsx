'use client';
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
import { useProfile } from '@/context/profileProvider';
import { formatDate } from '@/lib/utils';
import {
  Award,
  Clock,
  Gift,
  Star,
  TrendingUp,
  Trophy,
  User,
  ExternalLink,
  HandCoins,
  Sparkles,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PointsHistory, UserStats } from '@/types/types';

export default function AccountView() {
  const { countdown, formatTime } = useCountdown();
  const { profile, user } = useProfile();
  const [, setIsPageLoaded] = useState(false);
  const [pointsHistory, setPointsHistory] = useState<PointsHistory[]>([]);
  const router = useRouter();
  const timeToNextTicket = countdown ? Math.floor(countdown / 60) % 60 : 0;
  const [userStats, setUserStats] = useState<UserStats | null>(null);

  const getPointsHistory = async () => {
    const response = await fetch('/api/prize/history');
    if (!response.ok) {
      throw new Error('Failed to fetch points history');
    }
    const result = await response.json();
    setPointsHistory(result.data);
    console.log(result.data);
  };

  const getUserStats = async () => {
    const response = await fetch('/api/users/stats');
    const result = await response.json();
    console.log({ result });
    setUserStats(result);
  };

  useEffect(() => {
    setIsPageLoaded(true);
    getPointsHistory();
    getUserStats();
  }, []);

  return (
    <div className="container mx-auto max-w-4xl py-10">
      {/* Profil utilisateur */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Mon Compte</h1>
        <div className="flex items-center gap-2 rounded-lg bg-slate-100 p-3">
          <HandCoins className="text-yellow-500" />
          <span className="font-semibold">{profile?.points} points</span>
        </div>
      </div>

      {/* En-tête de profil */}
      <div className="mb-8">
        <Card className="bg-white shadow-sm">
          <CardContent className="flex flex-col items-center gap-4 p-4 sm:flex-row sm:items-center">
            <Avatar className="h-16 w-16 border-2 border-purple-200">
              <AvatarImage alt={profile?.full_name ?? ''} src={profile?.avatar_url ?? ''} />
              <AvatarFallback className="bg-purple-100 text-xl text-purple-700 uppercase">
                {profile?.full_name?.charAt(0) ?? user?.email?.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl font-bold text-slate-800">
                {profile?.full_name ?? user?.email}
              </h2>

              <div className="mt-1 flex items-center justify-center gap-1 text-sm text-slate-500 sm:justify-start">
                <User className="h-3 w-3" />
                <span>@{profile?.username ?? 'utilisateur'}</span>
              </div>

              <div className="mt-2 flex items-center justify-center gap-2 sm:justify-start">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-amber-400" />
                  <span className="text-xs text-slate-500">
                    Membre depuis: {formatDate(profile?.created_at ?? '').split(' ')[0]}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statistiques principales */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="bg-gradient-to-r from-green-50 to-green-100 transition-all hover:shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-green-700">Total Gagné</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="text-green-500" />
              <span className="text-2xl font-bold">{userStats?.totalWon}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 transition-all hover:shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-purple-700">Tickets Grattés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Gift className="text-purple-500" />
              <span className="text-2xl font-bold">{userStats?.scratched}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-amber-50 to-amber-100 transition-all hover:shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-amber-700">Plus Gros Gain</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Trophy className="text-amber-500" />
              <span className="text-2xl font-bold">{userStats?.biggestWin}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 transition-all hover:shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-blue-700">Série Actuelle</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Award className="text-blue-500" />
              <span className="text-2xl font-bold">{userStats?.currentStreak} j</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section principal et gains récents */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Ticket disponible */}
        <Card className="transition-all hover:shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Ticket gratuit</CardTitle>
                <CardDescription>Récupérez votre ticket gratuit</CardDescription>
              </div>
              {countdown !== null && countdown > 0 && (
                <Badge className="flex items-center gap-1" variant="outline">
                  <Clock size={14} />
                  {formatTime(countdown)}
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent>
            <Progress className="mb-3 h-2" value={((60 - timeToNextTicket) / 60) * 100} />

            <div className="flex flex-col items-center justify-center p-2">
              {countdown !== null && countdown > 0 ? (
                <div className="w-full text-center">
                  <div className="rounded-lg bg-slate-50 p-4 text-center">
                    <p className="mb-2 text-sm text-slate-600">Disponible dans:</p>
                    <div className="mb-2 text-xl font-bold text-slate-800">
                      {formatTime(countdown)}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full text-center">
                  <Gift className="mx-auto mb-3 h-10 w-10 text-purple-500" />
                  <p className="mb-3 text-sm text-slate-600">
                    Votre ticket gratuit est disponible!
                  </p>
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter>
            <Button
              className="w-full"
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
          </CardFooter>
        </Card>

        {/* Historique des gains */}
        <Card className="transition-all hover:shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Gains Récents</CardTitle>
                <CardDescription>Vos 5 derniers prix</CardDescription>
              </div>
              <Sparkles className="h-5 w-5 text-amber-500" />
            </div>
          </CardHeader>

          <CardContent>
            <ul className="divide-y">
              {pointsHistory.length === 0 ? (
                <li className="flex items-center justify-between py-2">
                  <p className="text-slate-500">Aucun gain récent</p>
                </li>
              ) : (
                pointsHistory.map((item, index) => (
                  <li key={index} className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium text-slate-800">{item.description}</p>
                      <p className="text-xs text-slate-500">{formatDate(item.created_at ?? '')}</p>
                    </div>
                    <Badge className="bg-purple-100 text-purple-700">{item.amount} pts</Badge>
                  </li>
                ))
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
