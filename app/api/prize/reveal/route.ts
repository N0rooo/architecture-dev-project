import { revealPrizeService } from '@/services/prize/revealPrizeService';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { attemptId } = await req.json();
  const { success, error } = await revealPrizeService(attemptId);

  if (!success) {
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }

  return NextResponse.json(
    { success: true, message: 'Prize revealed successfully' },
    { status: 200 },
  );
}
