'use client';
import HowItWorks from '@/components/HowItWorks';
import { useProfile } from '@/context/profileProvider';
import { premiumTickets } from '@/data/tickets';
import { HandCoins } from 'lucide-react';
import CountDownPart from '../_component/countDownPart';
import LoadingView from './loadingView';
import PremiumTicketCard from '../_component/premiumTicketCard';

export default function HomeView() {
  const { profile, loading } = useProfile();

  const userPoints = profile?.points;

  if (loading) {
    return <LoadingView />;
  }
  return (
    <div className="container mx-auto max-w-4xl py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tickets à Gratter</h1>
        <div className="flex items-center gap-2 rounded-lg bg-slate-100 p-3">
          <HandCoins className="text-yellow-500" />
          <span className="font-semibold">{userPoints} points</span>
        </div>
      </div>

      <CountDownPart />

      <div className="mt-6">
        <div className="m-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Tickets Premium</h2>
            <p className="text-muted-foreground">
              Utilisez vos points pour acheter des tickets premium avec des récompenses plus élevées
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {premiumTickets.map((ticket) => (
            <PremiumTicketCard key={ticket.id} ticket={ticket} userPoints={userPoints ?? 0} />
          ))}
        </div>
      </div>

      <HowItWorks />
    </div>
  );
}
