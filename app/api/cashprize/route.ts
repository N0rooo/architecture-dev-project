import { NextResponse } from "next/server";
import { getCashPrizeService } from "@/services/cashprize/getCashPrize";

export async function GET() {

  const { success, prize, error, timeRemaining } = await getCashPrizeService();

  if (error) {
    console.log({error})
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  console.log({prize});

  return NextResponse.json({ success, prize, timeRemaining });
}
