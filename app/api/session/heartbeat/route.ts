import { NextResponse } from "next/server";
import { touchCurrentSession } from "@/lib/auth/session";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host && new URL(origin).host !== host) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }

  try {
    const active = await touchCurrentSession();
    return NextResponse.json({ ok: active }, { status: active ? 200 : 401 });
  } catch (error) {
    console.error("Falha ao atualizar sessão.", error);
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}
