import { logoutService } from '@/services/auth/authServices';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { error } = await logoutService();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath('/', 'layout');
  return NextResponse.redirect(new URL('/login', req.url), {
    status: 302,
  });
}
