import { NextResponse } from 'next/server';
import { getLeaderboardService } from '@/services/leaderboard/getLeaderboardService';
import { getAllUsersService } from '@/services/admin/users/getAllUsersService';

export async function GET(request: Request) {
  try {
    const { data, error } = await getAllUsersService();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
