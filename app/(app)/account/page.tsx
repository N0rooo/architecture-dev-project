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
  ArrowRight,
  Clock,
  Gift,
  Star,
  TrendingUp,
  Trophy,
  User,
  Wallet,
  Calendar,
  ExternalLink,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AccountPage() {
  const { countdown, formatTime } = useCountdown();
  const { profile, user } = useProfile();
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const router = useRouter();

  // Statistiques de l'utilisateur
  const [userStats] = useState({
    totalWon: 2350,
    scratched: 48,
    biggestWin: 500,
    currentStreak: 7,
  });

  // Historique des gains récents
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

  return (
    <div className="container mx-auto max-w-4xl py-10">
      {/* Profil utilisateur */}
      <div className="mb-8">
        <Card className="bg-gradient-to-r from-slate-50 to-slate-100 shadow-sm">
          <CardContent className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6">
            <Avatar className="h-20 w-20 border-2 border-purple-200">
              <AvatarImage alt={profile?.full_name ?? ''} src={profile?.avatar_url ?? ''} />
              <AvatarFallback className="text-2xl bg-purple-100 text-purple-700 uppercase">
                {profile?.full_name?.charAt(0) ?? user?.email?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-slate-800">
                {profile?.full_name ?? user?.email}
              </h1>
              
              <div className="flex items-center justify-center sm:justify-start gap-1 text-sm text-slate-500 mt-1">
                <User className="h-3 w-3" />
                <span>@{profile?.username ?? 'utilisateur'}</span>
              </div>
              
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-3">
                <Badge className="bg-purple-100 text-purple-700 py-1.5 px-3 flex items-center gap-1">
                  <Wallet className="h-4 w-4" />
                  <span className="font-bold">{profile?.points} points</span>
                </Badge>
                
                <Badge className="bg-slate-100 text-slate-700 py-1.5 px-3 flex items-center gap-1">
                  <Star className="h-4 w-4 text-amber-400" />
                  <span>Membre depuis {formatDate(profile?.created_at ?? '').split(' ')[0]}</span>
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statistiques principales */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-col items-center text-center">
              <TrendingUp className="h-8 w-8 mb-2 text-green-500" />
              <span className="text-sm text-slate-600">Total Gagné</span>
              <span className="text-2xl font-bold text-slate-800">{userStats.totalWon}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-violet-50 shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-col items-center text-center">
              <Gift className="h-8 w-8 mb-2 text-purple-500" />
              <span className="text-sm text-slate-600">Tickets Grattés</span>
              <span className="text-2xl font-bold text-slate-800">{userStats.scratched}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-col items-center text-center">
              <Trophy className="h-8 w-8 mb-2 text-amber-500" />
              <span className="text-sm text-slate-600">Plus Gros Gain</span>
              <span className="text-2xl font-bold text-slate-800">{userStats.biggestWin}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-sky-50 shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-col items-center text-center">
              <Award className="h-8 w-8 mb-2 text-blue-500" />
              <span className="text-sm text-slate-600">Série Actuelle</span>
              <span className="text-2xl font-bold text-slate-800">{userStats.currentStreak} j</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section principal et gains récents */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Ticket disponible */}
        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Prochain ticket gratuit</CardTitle>
                <CardDescription>
                  Récupérez votre ticket chaque jour
                </CardDescription>
              </div>
              <Badge variant="outline" className="flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Quotidien
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="flex flex-col items-center justify-center p-2">
              {countdown !== null && countdown > 0 ? (
                <div className="w-full">
                  <div className="rounded-lg bg-slate-50 p-4 text-center">
                    <Clock className="mx-auto h-10 w-10 mb-3 text-slate-400" />
                    <p className="text-slate-600 mb-2 text-sm">
                      Disponible dans:
                    </p>
                    <div className="text-2xl font-bold text-slate-800 mb-4">
                      {formatTime(countdown)}
                    </div>
                    <Progress 
                      className="h-2 mb-2" 
                      value={Math.max(0, 100 - (countdown / 3600) * 100)} 
                    />
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>En attente</span>
                      <span>Disponible</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full rounded-lg border border-dashed border-slate-300 p-4 text-center">
                  <Gift className="mx-auto h-10 w-10 mb-3 text-purple-500" />
                  <p className="text-slate-600 mb-3 text-sm">
                    Ticket gratuit disponible!
                  </p>
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700" onClick={() => {
                    router.push('/ticket-gratuit');
                  }}>
                    Aller aux tickets
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Historique des gains */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle>Gains Récents</CardTitle>
            <CardDescription>Vos 5 derniers prix</CardDescription>
          </CardHeader>
          
          <CardContent>
            <ul className="divide-y">
              {prizeHistory.map((item, index) => (
                <li
                  key={index}
                  className="py-2 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-slate-800">{item.name}</p>
                    <p className="text-xs text-slate-500">{item.date}</p>
                  </div>
                  <Badge className="bg-purple-100 text-purple-700">
                    {item.amount} pts
                  </Badge>
                </li>
              ))}
            </ul>
          </CardContent>
          
          <CardFooter className="border-t pt-3">
            <Button className="w-full" variant="outline" size="sm">
              <ExternalLink className="mr-2 h-4 w-4" />
              Voir Tout l'Historique
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}