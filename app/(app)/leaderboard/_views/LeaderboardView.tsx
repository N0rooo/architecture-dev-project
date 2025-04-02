'use client';

import { useEffect, useState } from 'react';
import { Profile } from '@/types/types';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy, Medal, Award, Users, Crown, Star } from 'lucide-react';

export default function LeaderboardView() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [leaderboard, setLeaderboard] = useState<Profile[]>([]);
  // Pas de recherche, nous utilisons la liste complète
  const filteredLeaderboard = leaderboard;

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('/api/leaderboard?limit=10');
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch leaderboard');
        }

        setLeaderboard(result.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch leaderboard');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  // Helper function to get rank badge and styling
  const getRankStyling = (index: number) => {
    switch (index) {
      case 0:
        return {
          icon: <Crown className="h-5 w-5" />,
          color: 'bg-gradient-to-r from-yellow-400 to-amber-300 text-amber-900',
          textColor: 'text-amber-900',
          badge: 'bg-amber-100 text-amber-800'
        };
      case 1:
        return {
          icon: <Medal className="h-5 w-5" />,
          color: 'bg-gradient-to-r from-slate-300 to-slate-200 text-slate-700',
          textColor: 'text-slate-700',
          badge: 'bg-slate-100 text-slate-700'
        };
      case 2:
        return {
          icon: <Award className="h-5 w-5" />,
          color: 'bg-gradient-to-r from-amber-600 to-amber-500 text-amber-100',
          textColor: 'text-amber-700',
          badge: 'bg-amber-100 text-amber-700'
        };
      default:
        return {
          icon: <Star className="h-4 w-4" />,
          color: 'bg-slate-100 text-slate-700',
          textColor: 'text-slate-600',
          badge: 'bg-slate-100 text-slate-700'
        };
    }
  };

  if (loading) {
    return (
      <div className="w-full">
        <div className="mb-8 flex flex-col gap-2">
          <Skeleton className="h-12 w-60" />
          <Skeleton className="h-6 w-96" />
        </div>
        
        <div className="mb-6">
          <Skeleton className="h-10 w-60" />
        </div>
        
        <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
        
        <div className="space-y-4">
          {[...Array(7)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="flex items-center justify-center p-6">
            <div className="text-xl font-semibold text-red-600">Erreur: {error}</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Top 3 users for highlighted display
  const topUsers = leaderboard.slice(0, 3);
  // Rest of the users in the list
  const restOfUsers = filteredLeaderboard.slice(3);

  return (
    <div className="w-full">
      {/* Header section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Classement des joueurs</h1>
        <p className="mt-2 text-slate-500">
          Découvrez les meilleurs joueurs et leur nombre de points
        </p>
      </div>
      
      {/* Info cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-gradient-to-r from-slate-50 to-slate-100 shadow-sm">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-full bg-purple-100 p-2">
              <Trophy className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total joueurs</p>
              <p className="text-xl font-bold text-slate-800">{leaderboard.length}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 shadow-sm">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-full bg-amber-100 p-2">
              <Crown className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Meilleur score</p>
              <p className="text-xl font-bold text-amber-700">
                {leaderboard.length > 0 ? leaderboard[0].points : 0} points
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-blue-50 to-sky-50 shadow-sm sm:col-span-2 lg:col-span-1">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-full bg-blue-100 p-2">
              <Star className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Moyenne des points</p>
              <p className="text-xl font-bold text-blue-700">
                {leaderboard.length > 0 
                  ? Math.round(leaderboard.reduce((sum, user) => sum + user.points, 0) / leaderboard.length) 
                  : 0} points
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Top 3 winners section - desktop only */}
      {topUsers.length > 0 && (
        <div className="mb-10 hidden lg:grid lg:grid-cols-3 lg:gap-6">
          {/* Render top 3 in a special way */}
          {[1, 0, 2].map((adjustedIndex) => {
            const user = topUsers[adjustedIndex];
            const actualIndex = adjustedIndex;
            const { icon, color, textColor, badge } = getRankStyling(actualIndex);
            const imageSize = 64;
            
            return (
              <div key={user.id} className="flex">
                <Card className="max-h-80 w-full overflow-hidden shadow-md transition-all hover:shadow-lg">
                  <div className={`${color} py-3 text-center`}>
                    <div className="flex items-center justify-center gap-1 font-semibold">
                      {icon}
                      {actualIndex === 0 ? "1ère place" : `${actualIndex + 1}ème place`}
                    </div>
                  </div>
                  
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <div className="relative mb-3 mt-2">
                      {user.avatar_url ? (
                        <Image
                          alt={user.username || 'User avatar'}
                          className="rounded-full object-cover"
                          height={imageSize}
                          src={user.avatar_url}
                          width={imageSize}
                        />
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-200 text-2xl font-bold text-slate-600">
                          {(user.username || 'A')[0].toUpperCase()}
                        </div>
                      )}
                    </div>
                    
                    <h3 className="mb-1 text-lg font-semibold text-slate-800">
                      {user.full_name || user.username || 'Anonymous'}
                    </h3>
                    <p className="mb-2 text-sm text-slate-500">@{user.username}</p>
                    
                    <div className="mt-1 flex flex-col items-center">
                      <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                        {user.points} points
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Main leaderboard listing */}
      <div className="w-full space-y-4">
        {/* Top 3 on mobile shown as list items */}
        <div className="lg:hidden space-y-3">
          {topUsers.map((profile, index) => {
            const { icon, color, badge } = getRankStyling(index);
            return (
              <div
                key={profile.id}
                className="flex items-center justify-between rounded-lg bg-white p-4 shadow-md transition-all hover:shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${color}`}>
                    {icon}
                  </div>
                  <div className="flex items-center gap-3">
                    {profile.avatar_url ? (
                      <Image
                        alt={profile.username || 'User avatar'}
                        className="rounded-full"
                        height={40}
                        src={profile.avatar_url}
                        width={40}
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-lg font-bold text-slate-600">
                        {(profile.username || 'A')[0].toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="text-base font-semibold text-slate-800">
                        {profile.full_name || profile.username || 'Anonymous'}
                      </div>
                      <div className="text-xs text-slate-500">@{profile.username}</div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`${badge} font-medium`}>
                    {profile.points} points
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Rest of the users in a standard list */}
        {restOfUsers.length === 0 && filteredLeaderboard.length === 0 ? (
          <Card className="bg-slate-50 py-8">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <div className="rounded-full bg-slate-100 p-6">
                <Users className="h-10 w-10 text-slate-400" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-slate-700">Aucun joueur trouvé</h3>
              <p className="mt-2 text-sm text-slate-500">
                Le classement est vide pour le moment.
              </p>
            </CardContent>
          </Card>
        ) : (
          restOfUsers.map((profile, index) => (
            <div
              key={profile.id}
              className="flex items-center justify-between rounded-lg bg-white p-4 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-base font-semibold text-slate-600">
                  {index + 4}
                </div>
                <div className="flex items-center gap-3">
                  {profile.avatar_url ? (
                    <Image
                      alt={profile.username || 'User avatar'}
                      className="rounded-full"
                      height={36}
                      src={profile.avatar_url}
                      width={36}
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-base font-bold text-slate-600">
                      {(profile.username || 'A')[0].toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-semibold text-slate-800">
                      {profile.full_name || profile.username || 'Anonymous'}
                    </div>
                    <div className="text-xs text-slate-500">@{profile.username}</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="rounded-lg bg-purple-50 px-3 py-1.5">
                  <span className="font-medium text-purple-700">{profile.points} points</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}