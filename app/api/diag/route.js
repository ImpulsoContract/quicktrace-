import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const vars = [
    "POSTGRES_PRISMA_URL",
    "NEXTAUTH_SECRET",
    "NEXTAUTH_URL",
    "MASTER_PASSWORD",
    "SMTP_HOST",
    "SMTP_USER",
    "SMTP_PASS",
    "SMTP_PORT",
    "SMTP_FROM"
  ];

  const status = vars.reduce((acc, v) => {
    acc[v] = process.env[v] ? "SET" : "MISSING";
    return acc;
  }, {});

  return NextResponse.json({ 
    diagnostics: status,
    node_env: process.env.NODE_ENV 
  });
}
