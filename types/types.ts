import { loginSchema, signupSchema, userSchema } from '@/lib/schema';
import { z } from 'zod';
import { Database } from './supabase';

// ZOD TYPES
export type User = z.infer<typeof userSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;

// SUPABASE TYPES
export type Prize = Database['public']['Tables']['prize']['Row'];
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Ticket = Database['public']['Tables']['user_prize_attempts']['Row'];
export type PointsHistory = Database['public']['Tables']['points_history']['Row'];

export type TicketWithPrize = Ticket & {
  prize: Prize;
  ticket_category?: number;
};

export interface UserStats {
  totalWon: number;
  scratched: number;
  biggestWin: number;
  currentStreak: number;
}
