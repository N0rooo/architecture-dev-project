import { NextResponse } from "next/server";
import { getCashPrizeService } from "@/services/cashprize/getCashPrize";

export async function GET() {



  const { data } = await getCashPrizeService();

  console.log(data);

  return NextResponse.json(data);
}
