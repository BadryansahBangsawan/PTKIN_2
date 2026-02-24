import { scryptSync, timingSafeEqual } from "node:crypto";
import { eq, or } from "drizzle-orm";
import { z } from "zod";
import { db, users } from "@uin-samata/db";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const requestSchema = z.object({
  username: z.string().trim().min(1).max(100),
  password: z.string().min(1).max(200),
});

function verifyPassword(password: string, storedHash: string) {
  const [salt, hashHex] = storedHash.split(":");
  if (!salt || !hashHex) return false;

  const derived = scryptSync(password, salt, 64);
  const stored = Buffer.from(hashHex, "hex");
  if (stored.length !== derived.length) return false;

  return timingSafeEqual(derived, stored);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, code: "VALIDATION_ERROR", message: "Username dan password wajib diisi." },
      { status: 400 },
    );
  }

  const { username, password } = parsed.data;

  try {
    const found = await db
      .select({
        id: users.id,
        username: users.username,
        nisn: users.nisn,
        nama: users.nama,
        email: users.email,
        password: users.password,
      })
      .from(users)
      .where(or(eq(users.username, username), eq(users.nisn, username)))
      .limit(1);

    const user = found[0];
    if (!user || !verifyPassword(password, user.password)) {
      return NextResponse.json(
        {
          ok: false,
          code: "INVALID_CREDENTIALS",
          message: "Username/NISN atau password salah.",
        },
        { status: 401 },
      );
    }

    return NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        username: user.username,
        nisn: user.nisn,
        nama: user.nama,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login query error:", error);
    return NextResponse.json(
      {
        ok: false,
        code: "DB_ERROR",
        message: "Gagal memproses login. Coba lagi.",
      },
      { status: 500 },
    );
  }
}
