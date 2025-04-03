import { deleteUserService } from '@/services/admin/users/deleteUserService';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request) {
  const { id } = await request.json();
  const { success, error } = await deleteUserService(id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success });
}
