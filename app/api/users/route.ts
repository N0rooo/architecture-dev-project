import { NextResponse } from "next/server";
import { getUsersService } from "@/services/users/getUserService";
import { createUserService } from "@/services/users/createUserService";

export async function GET() {
  const limit = 10;

  const { data } = await getUsersService(limit);

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const { user } = await request.json();

  const { data, error } = await createUserService({ user });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}