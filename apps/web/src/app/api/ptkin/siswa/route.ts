import { z } from "zod";
import { NextResponse } from "next/server";
import { validatePtkinSiswa } from "@/server/ptkin-siswa";

const requestSchema = z.object({
  nisn: z.string().trim().min(1),
  tanggalLahir: z.string().trim().min(1),
});

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { status: "upstream_error", message: "Payload tidak valid." },
      { status: 400 },
    );
  }

  const { nisn, tanggalLahir } = parsed.data;
  const result = await validatePtkinSiswa({ nisn, tanggalLahir });

  if (result.status === "auth_error" || result.status === "upstream_error") {
    return NextResponse.json(result, { status: 502 });
  }

  return NextResponse.json(result);
}
