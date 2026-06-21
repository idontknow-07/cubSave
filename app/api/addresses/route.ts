import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    Bitcoin: process.env.ADDR_BTC || "",
    "ERC-20": process.env.ADDR_ETH || "",
    "TRC-20": process.env.ADDR_TRC20 || "",
    "BEP20": process.env.ADDR_BEP20 || "",
  });
}
