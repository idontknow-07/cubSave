import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    Bitcoin: process.env.ADDR_BTC || "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    "ERC-20": process.env.ADDR_ETH || "0x742d35Cc6634C0532925a3b8D4C9C0B0c3b0e0a1",
    "TRC-20": process.env.ADDR_TRC20 || "TJYeasTPa6gpTgCxEFnFEbzVzMGr5oq4Z1",
    "BEP20": process.env.ADDR_BEP20 || "0x0000000000000000000000000000000000000000",
  });
}
