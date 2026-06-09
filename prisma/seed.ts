import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";
import * as bip39 from "bip39";
import { FUNCTIONAL_COINS } from "../lib/coins";
import path from "path";

const dbPath = path.resolve(process.cwd(), "prisma/dev.db");
const adapter = new PrismaBetterSqlite3({ url: dbPath });
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  const adminMnemonic = bip39.generateMnemonic();
  const userMnemonic = bip39.generateMnemonic();

  const admin = await prisma.user.upsert({
    where: { email: "admin@SecureChain.com" },
    update: {},
    create: {
      email: "admin@SecureChain.com",
      username: "admin",
      passwordHash: await bcrypt.hash("admin123", 10),
      withdrawalPin: await bcrypt.hash("1234", 10),
      mnemonic: adminMnemonic,
      role: "admin",
    },
  });

  const user = await prisma.user.upsert({
    where: { email: "demo@SecureChain.com" },
    update: {},
    create: {
      email: "demo@SecureChain.com",
      username: "demouser",
      passwordHash: await bcrypt.hash("demo123", 10),
      withdrawalPin: await bcrypt.hash("1234", 10),
      mnemonic: userMnemonic,
      role: "user",
    },
  });

  const demoBalances: Record<string, number> = {
    "BTC-Bitcoin": 0.05,
    "ETH-ERC-20": 1.2,
    "USDT-ERC-20": 500,
    "USDT-TRC-20": 250,
    "BNB-BSC": 2.5,
  };

  for (const c of FUNCTIONAL_COINS) {
    const key = `${c.coin}-${c.network}`;
    await prisma.wallet.upsert({
      where: { userId_coin_network: { userId: user.id, coin: c.coin, network: c.network } },
      update: {},
      create: {
        userId: user.id,
        coin: c.coin,
        network: c.network,
        balance: demoBalances[key] || 0,
      },
    });
    await prisma.wallet.upsert({
      where: { userId_coin_network: { userId: admin.id, coin: c.coin, network: c.network } },
      update: {},
      create: { userId: admin.id, coin: c.coin, network: c.network, balance: 0 },
    });
  }

  console.log("Seeded:", { admin: admin.email, user: user.email });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
