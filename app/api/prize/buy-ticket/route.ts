import { buyTicketService } from '@/services/prize/buyTicketService';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { ticketId } = await req.json();
  const { success, error } = await buyTicketService({ ticketId });

  if (!success) {
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }

  return NextResponse.json(
    { success: true, message: 'Ticket purchased successfully' },
    { status: 200 },
  );
}
