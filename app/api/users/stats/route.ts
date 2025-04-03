import { NextResponse } from 'next/server';
import { getUserStatsService } from '@/services/users/stats/getUserStatsService';

export async function GET() {
  const { data, error } = await getUserStatsService();
  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }
  return NextResponse.json(data);
}
