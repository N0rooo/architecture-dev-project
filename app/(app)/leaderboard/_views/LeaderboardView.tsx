'use client';

import { useEffect, useState } from 'react';
import { Profile } from '@/types/types';
import Image from 'next/image';

export default function LeaderboardView() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [leaderboard, setLeaderboard] = useState<Profile[]>([]);

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

  if (loading) {
    return (
      <div className="container mx-auto flex max-w-5xl flex-col items-center gap-6 p-6">
        <div className="text-xl font-semibold">Loading leaderboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto flex max-w-5xl flex-col items-center gap-6 p-6">
        <div className="text-xl font-semibold text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex flex-col items-center gap-6 p-6">
      <h1 className="text-4xl font-bold text-gray-900">Leaderboard</h1>
      <div className="w-full space-y-4">
        {leaderboard.map((profile, index) => (
          <div
            key={profile.id}
            className="flex items-center justify-between rounded-lg bg-white p-6 shadow-md transition-all hover:shadow-lg"
          >
            <div className="flex items-center gap-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl font-bold text-gray-600">
                {index + 1}
              </div>
              <div className="flex items-center gap-4">
                {profile.avatar_url ? (
                  <Image
                    alt={profile.username || 'User avatar'}
                    className="rounded-full"
                    height={48}
                    src={profile.avatar_url}
                    width={48}
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-gray-200" />
                )}
                <div>
                  <div className="text-lg font-semibold text-gray-900">
                    {profile.full_name || profile.username || 'Anonymous'}
                  </div>
                  <div className="text-sm text-gray-500">@{profile.username}</div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-yellow-100 px-4 py-2 text-base font-semibold text-yellow-800">
                {profile.points} points
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
