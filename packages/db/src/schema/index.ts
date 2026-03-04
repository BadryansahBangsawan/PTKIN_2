import { pgTable, serial, text, date, timestamp, integer } from "drizzle-orm/pg-core";

export const users = pgTable("ptkin_users", {
  id: serial("id").primaryKey(),
  nisn: text("nisn").notNull().unique(),
  nama: text("nama").notNull(),
  tanggalLahir: date("tanggal_lahir").notNull(),
  telpon: text("telpon").notNull(),
  email: text("email").notNull(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Biodata table for form pendaftaran
export const biodata = pgTable("ptkin_biodata", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  noKTP: text("no_ktp"),
  nama: text("nama"),
  jenisKelamin: text("jenis_kelamin"),
  tempatLahir: text("tempat_lahir"),
  tanggalLahir: date("tanggal_lahir"),
  agama: text("agama"),
  noTelp: text("no_telp"),
  email: text("email"),
  provinsi: text("provinsi"),
  kotaKabupaten: text("kota_kabupaten"),
  alamat: text("alamat"),
  namaAyah: text("nama_ayah"),
  namaIbu: text("nama_ibu"),
  gajiOrtu: text("gaji_ortu"),
  pesertaKhusus: text("peserta_khusus"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Pendidikan table for form pendaftaran
export const pendidikan = pgTable("ptkin_pendidikan", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  nisn: text("nisn"),
  npsn: text("npsn"),
  namaSekolah: text("nama_sekolah"),
  statusSekolah: text("status_sekolah"),
  provinsi: text("provinsi"),
  kota: text("kota"),
  kecamatan: text("kecamatan"),
  jenisSekolah: text("jenis_sekolah"),
  akreditasi: text("akreditasi"),
  alamat: text("alamat"),
  noIjazah: text("no_ijazah"),
  noSKL: text("no_skl"),
  noKTP: text("no_ktp"),
  noKartuSiswa: text("no_kartu_siswa"),
  pernahPesantren: text("pernah_pesantren"),
  namaPesantren: text("nama_pesantren"),
  lamaPesantren: text("lama_pesantren"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
