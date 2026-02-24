import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { db, users } from "@uin-samata/db";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const deleteSchema = z.object({
  id: z.number().int().positive(),
});

export async function GET() {
  try {
    const rows = await db
      .select({
        id: users.id,
        nisn: users.nisn,
        nama: users.nama,
        email: users.email,
        telpon: users.telpon,
        username: users.username,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt))
      .limit(100);

    return NextResponse.json({
      ok: true,
      users: rows,
    });
  } catch (error) {
    console.error("Super admin list users error:", error);
    return NextResponse.json(
      {
        ok: false,
        code: "DB_ERROR",
        message: "Gagal mengambil daftar user.",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = deleteSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        code: "VALIDATION_ERROR",
        message: "ID user tidak valid.",
      },
      { status: 400 },
    );
  }

  try {
    const deleted = await db
      .delete(users)
      .where(eq(users.id, parsed.data.id))
      .returning({
        id: users.id,
        nama: users.nama,
        nisn: users.nisn,
      });

    const user = deleted[0];
    if (!user) {
      return NextResponse.json(
        {
          ok: false,
          code: "NOT_FOUND",
          message: "User tidak ditemukan.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      ok: true,
      message: `User ${user.nama} (${user.nisn}) berhasil dihapus.`,
      user,
    });
  } catch (error) {
    console.error("Super admin delete user error:", error);
    return NextResponse.json(
      {
        ok: false,
        code: "DB_ERROR",
        message: "Gagal menghapus user.",
      },
      { status: 500 },
    );
  }
}
