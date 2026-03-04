import { NextResponse } from "next/server";
import { db, biodata, pendidikan } from "@uin-samata/db";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const runtime = "nodejs";

const biodataSchema = z.object({
  noKTP: z.string().optional(),
  nama: z.string().optional(),
  jenisKelamin: z.string().optional(),
  tempatLahir: z.string().optional(),
  tanggalLahir: z.string().optional(),
  agama: z.string().optional(),
  noTelp: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  provinsi: z.string().optional(),
  kotaKabupaten: z.string().optional(),
  alamat: z.string().optional(),
  namaAyah: z.string().optional(),
  namaIbu: z.string().optional(),
  gajiOrtu: z.string().optional(),
  pesertaKhusus: z.string().optional(),
});

const pendidikanSchema = z.object({
  nisn: z.string().optional(),
  npsn: z.string().optional(),
  namaSekolah: z.string().optional(),
  statusSekolah: z.string().optional(),
  provinsi: z.string().optional(),
  kota: z.string().optional(),
  kecamatan: z.string().optional(),
  jenisSekolah: z.string().optional(),
  akreditasi: z.string().optional(),
  alamat: z.string().optional(),
  noIjazah: z.string().optional(),
  noSKL: z.string().optional(),
  noKTP: z.string().optional(),
  noKartuSiswa: z.string().optional(),
  pernahPesantren: z.string().optional(),
  namaPesantren: z.string().optional(),
  lamaPesantren: z.string().optional(),
});

const requestSchema = z.object({
  userId: z.number().int().positive(),
  biodata: biodataSchema,
  pendidikan: pendidikanSchema,
});

// GET - Fetch pendaftaran data by userId
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { ok: false, code: "VALIDATION_ERROR", message: "User ID diperlukan." },
      { status: 400 }
    );
  }

  try {
    const userIdNum = parseInt(userId, 10);

    const biodataResult = await db
      .select()
      .from(biodata)
      .where(eq(biodata.userId, userIdNum))
      .limit(1);

    const pendidikanResult = await db
      .select()
      .from(pendidikan)
      .where(eq(pendidikan.userId, userIdNum))
      .limit(1);

    return NextResponse.json({
      ok: true,
      biodata: biodataResult[0] || null,
      pendidikan: pendidikanResult[0] || null,
    });
  } catch (error) {
    console.error("Fetch pendaftaran error:", error);
    return NextResponse.json(
      { ok: false, code: "DB_ERROR", message: "Gagal mengambil data pendaftaran." },
      { status: 500 }
    );
  }
}

// POST - Create or update pendaftaran data
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, code: "VALIDATION_ERROR", message: "Data pendaftaran tidak valid.", errors: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { userId, biodata: biodataData, pendidikan: pendidikanData } = parsed.data;

  try {
    // Check if biodata exists
    const existingBiodata = await db
      .select()
      .from(biodata)
      .where(eq(biodata.userId, userId))
      .limit(1);

    // Check if pendidikan exists
    const existingPendidikan = await db
      .select()
      .from(pendidikan)
      .where(eq(pendidikan.userId, userId))
      .limit(1);

    // Upsert biodata
    if (existingBiodata.length > 0) {
      await db
        .update(biodata)
        .set({
          noKTP: biodataData.noKTP || null,
          nama: biodataData.nama || null,
          jenisKelamin: biodataData.jenisKelamin || null,
          tempatLahir: biodataData.tempatLahir || null,
          tanggalLahir: biodataData.tanggalLahir || null,
          agama: biodataData.agama || null,
          noTelp: biodataData.noTelp || null,
          email: biodataData.email || null,
          provinsi: biodataData.provinsi || null,
          kotaKabupaten: biodataData.kotaKabupaten || null,
          alamat: biodataData.alamat || null,
          namaAyah: biodataData.namaAyah || null,
          namaIbu: biodataData.namaIbu || null,
          gajiOrtu: biodataData.gajiOrtu || null,
          pesertaKhusus: biodataData.pesertaKhusus || null,
          updatedAt: new Date(),
        })
        .where(eq(biodata.userId, userId));
    } else {
      await db.insert(biodata).values({
        userId,
        noKTP: biodataData.noKTP || null,
        nama: biodataData.nama || null,
        jenisKelamin: biodataData.jenisKelamin || null,
        tempatLahir: biodataData.tempatLahir || null,
        tanggalLahir: biodataData.tanggalLahir || null,
        agama: biodataData.agama || null,
        noTelp: biodataData.noTelp || null,
        email: biodataData.email || null,
        provinsi: biodataData.provinsi || null,
        kotaKabupaten: biodataData.kotaKabupaten || null,
        alamat: biodataData.alamat || null,
        namaAyah: biodataData.namaAyah || null,
        namaIbu: biodataData.namaIbu || null,
        gajiOrtu: biodataData.gajiOrtu || null,
        pesertaKhusus: biodataData.pesertaKhusus || null,
      });
    }

    // Upsert pendidikan
    if (existingPendidikan.length > 0) {
      await db
        .update(pendidikan)
        .set({
          nisn: pendidikanData.nisn || null,
          npsn: pendidikanData.npsn || null,
          namaSekolah: pendidikanData.namaSekolah || null,
          statusSekolah: pendidikanData.statusSekolah || null,
          provinsi: pendidikanData.provinsi || null,
          kota: pendidikanData.kota || null,
          kecamatan: pendidikanData.kecamatan || null,
          jenisSekolah: pendidikanData.jenisSekolah || null,
          akreditasi: pendidikanData.akreditasi || null,
          alamat: pendidikanData.alamat || null,
          noIjazah: pendidikanData.noIjazah || null,
          noSKL: pendidikanData.noSKL || null,
          noKTP: pendidikanData.noKTP || null,
          noKartuSiswa: pendidikanData.noKartuSiswa || null,
          pernahPesantren: pendidikanData.pernahPesantren || null,
          namaPesantren: pendidikanData.namaPesantren || null,
          lamaPesantren: pendidikanData.lamaPesantren || null,
          updatedAt: new Date(),
        })
        .where(eq(pendidikan.userId, userId));
    } else {
      await db.insert(pendidikan).values({
        userId,
        nisn: pendidikanData.nisn || null,
        npsn: pendidikanData.npsn || null,
        namaSekolah: pendidikanData.namaSekolah || null,
        statusSekolah: pendidikanData.statusSekolah || null,
        provinsi: pendidikanData.provinsi || null,
        kota: pendidikanData.kota || null,
        kecamatan: pendidikanData.kecamatan || null,
        jenisSekolah: pendidikanData.jenisSekolah || null,
        akreditasi: pendidikanData.akreditasi || null,
        alamat: pendidikanData.alamat || null,
        noIjazah: pendidikanData.noIjazah || null,
        noSKL: pendidikanData.noSKL || null,
        noKTP: pendidikanData.noKTP || null,
        noKartuSiswa: pendidikanData.noKartuSiswa || null,
        pernahPesantren: pendidikanData.pernahPesantren || null,
        namaPesantren: pendidikanData.namaPesantren || null,
        lamaPesantren: pendidikanData.lamaPesantren || null,
      });
    }

    return NextResponse.json({
      ok: true,
      message: "Data pendaftaran berhasil disimpan.",
    });
  } catch (error) {
    console.error("Save pendaftaran error:", error);
    return NextResponse.json(
      { ok: false, code: "DB_ERROR", message: "Gagal menyimpan data pendaftaran ke database." },
      { status: 500 }
    );
  }
}
