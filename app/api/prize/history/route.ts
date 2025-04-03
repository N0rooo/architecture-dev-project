import { NextResponse } from 'next/server';
import { getHistoryService } from '@/services/prize/getHistoryService';

export async function GET() {
  const { data, error } = await getHistoryService();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
