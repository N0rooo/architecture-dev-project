export const premiumTickets: PremiumTicket[] = [
  {
    id: 1,
    name: 'Argent',
    price: 100,
    minReward: 0,
    maxReward: 200,
    color: 'bg-slate-100',
    textColor: 'text-slate-700',
  },
  {
    id: 2,
    name: 'Or',
    price: 250,
    minReward: 50,
    maxReward: 500,
    color: 'bg-amber-100',
    textColor: 'text-amber-700',
  },
  {
    id: 3,
    name: 'Platine',
    price: 500,
    minReward: 100,
    maxReward: 1000,
    color: 'bg-cyan-100',
    textColor: 'text-cyan-700',
  },
  {
    id: 4,
    name: 'Mystère',
    price: 350,
    minReward: 0,
    color: 'bg-purple-100',
    textColor: 'text-purple-700',
  },
];

export type PremiumTicket = {
  id: number;
  name: string;
  price: number;
  minReward: number;
  maxReward?: number;
  color: string;
  textColor: string;
};
