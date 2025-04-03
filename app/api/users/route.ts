import { NextResponse } from 'next/server';
import { getUsersService } from '@/services/users/getUserService';

export async function GET() {
  const { data, error, role } = await getUsersService();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data, role });
}
