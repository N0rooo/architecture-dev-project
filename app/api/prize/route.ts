import { NextResponse } from 'next/server';
import { getFreePrizeService } from '@/services/prize/getFreePrizeService';

export async function GET() {
  const { success, prize, error, timeRemaining } = await getFreePrizeService();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success, prize, timeRemaining });
}
