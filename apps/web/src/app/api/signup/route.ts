import { randomBytes, scryptSync } from "node:crypto";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db, users } from "@uin-samata/db";
import { NextResponse } from "next/server";
import { validatePtkinSiswa } from "@/server/ptkin-siswa";
import { sendCredentialsEmailViaResend } from "@/server/email-resend";

export const runtime = "nodejs";

const requestSchema = z.object({
  nisn: z.string().trim().regex(/^\d{10}$/),
  tanggalLahir: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/),
  nama: z.string().trim().max(100).optional(),
  telpon: z.string().trim().min(8).max(20),
  email: z.string().trim().email().max(100),
});

function generatePassword() {
  return randomBytes(6).toString("base64url");
}

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, code: "VALIDATION_ERROR", message: "Data registrasi tidak valid." },
      { status: 400 },
    );
  }

  const { nisn, tanggalLahir, telpon, email } = parsed.data;
  const username = nisn;
  const plainPassword = generatePassword();
  const passwordHash = hashPassword(plainPassword);

  const ptkinValidation = await validatePtkinSiswa({ nisn, tanggalLahir });
  if (ptkinValidation.status !== "ok") {
    const statusCode =
      ptkinValidation.status === "auth_error" || ptkinValidation.status === "upstream_error"
        ? 502
        : 400;

    const messages: Record<Exclude<typeof ptkinValidation.status, "ok">, string> = {
      empty: "Data NISN tidak ditemukan di sumber PTKIN/Dapodik.",
      empty_tahun_lulus: "Data lulusan tidak valid (tahun lulus kosong).",
      expired: "Tahun lulus tidak memenuhi syarat.",
      wrong: "Tanggal lahir tidak sesuai dengan data Kemendikbud/Dapodik.",
      auth_error: "Gagal mengakses layanan token PTKIN.",
      upstream_error: "Layanan PTKIN sedang bermasalah.",
    };

    return NextResponse.json(
      {
        ok: false,
        code: "PTKIN_VALIDATION_FAILED",
        ptkinStatus: ptkinValidation.status,
        message: messages[ptkinValidation.status],
      },
      { status: statusCode },
    );
  }

  const nama = ptkinValidation.data.nama || (parsed.data.nama?.trim() ?? "");
  if (!nama) {
    return NextResponse.json(
      {
        ok: false,
        code: "VALIDATION_ERROR",
        message: "Nama tidak tersedia dari hasil validasi PTKIN.",
      },
      { status: 400 },
    );
  }

  try {
    const inserted = await db
      .insert(users)
      .values({
        nisn,
        nama,
        tanggalLahir: ptkinValidation.data.tanggal_lahir,
        telpon,
        email,
        username,
        password: passwordHash,
      })
      .returning({
        id: users.id,
        username: users.username,
        email: users.email,
      });

    const user = inserted[0];

    try {
      await sendCredentialsEmailViaResend({
        to: email,
        nama,
        username,
        password: plainPassword,
      });
    } catch (emailError) {
      console.error("Signup email send error:", emailError);

      try {
        await db.delete(users).where(eq(users.id, user.id));
      } catch (rollbackError) {
        console.error("Signup rollback after email failure failed:", rollbackError);
      }

      return NextResponse.json(
        {
          ok: false,
          code: "EMAIL_SEND_FAILED",
          message:
            "Registrasi dibatalkan karena email kredensial gagal dikirim. Silakan coba lagi.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      ok: true,
      user,
      delivery: {
        emailSent: true,
      },
    });
  } catch (error) {
    const maybeError = error as { code?: string; constraint?: string; detail?: string };

    if (maybeError?.code === "23505") {
      return NextResponse.json(
        {
          ok: false,
          code: "DUPLICATE_USER",
          message: "NISN sudah terdaftar (username sudah ada).",
        },
        { status: 409 },
      );
    }

    console.error("Signup insert error:", error);
    return NextResponse.json(
      {
        ok: false,
        code: "DB_ERROR",
        message: "Gagal menyimpan data registrasi ke database.",
      },
      { status: 500 },
    );
  }
}
