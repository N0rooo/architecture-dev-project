import { NextResponse } from 'next/server';
import { getUsersService } from '@/services/users/getUserService';
import { getTicketsService } from '@/services/tickets/getTicketsService';

export async function GET() {
  const { data, error } = await getTicketsService();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
