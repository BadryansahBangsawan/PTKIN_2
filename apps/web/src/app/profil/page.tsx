"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LogOut, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { clearFormPendaftaranData } from "@/lib/form-pendaftaran-store";

type ProfileState = {
  name: string;
  username: string;
};

function getCookieValue(name: string) {
  if (typeof document === "undefined") return "";
  const row = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(`${name}=`));
  if (!row) return "";

  const value = row.slice(name.length + 1);
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function getInitials(name: string) {
  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) return "U";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();

  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function readProfileFromCookies(): ProfileState | null {
  const isLoggedIn = getCookieValue("umptkin_login");
  if (!isLoggedIn) return null;

  const username = getCookieValue("umptkin_user").trim();
  const name = (getCookieValue("umptkin_name").trim() || username).trim();
  if (!name) return null;

  return { name, username };
}

export default function ProfilPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileState | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const sync = () => {
      const next = readProfileFromCookies();
      setProfile(next);
      setIsReady(true);

      if (!next) {
        router.replace("/");
      }
    };

    const onVisibilityChange = () => {
      if (!document.hidden) sync();
    };

    sync();
    window.addEventListener("focus", sync);
    window.addEventListener("umptkin-auth-changed", sync as EventListener);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("focus", sync);
      window.removeEventListener("umptkin-auth-changed", sync as EventListener);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [router]);

  const initials = useMemo(() => getInitials(profile?.name ?? ""), [profile?.name]);

  const handleLogout = () => {
    if (typeof document === "undefined") return;
    document.cookie = "umptkin_login=; path=/; max-age=0";
    document.cookie = "umptkin_user=; path=/; max-age=0";
    document.cookie = "umptkin_name=; path=/; max-age=0";
    clearFormPendaftaranData();
    window.dispatchEvent(new Event("umptkin-auth-changed"));
    router.replace("/");
  };

  if (!isReady || !profile) {
    return (
      <div className="min-h-[50vh] bg-gradient-to-br from-primary/5 via-background to-primary/5 px-4 py-10">
        <div className="mx-auto max-w-4xl">
          <Card className="rounded-2xl border-0 shadow-xl">
            <CardContent className="px-6 py-8">
              <p className="text-sm text-gray-600">Memuat profil...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-primary/5 via-background to-primary/5 px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <Card className="rounded-2xl border-0 shadow-2xl">
          <CardHeader className="border-b border-primary/10 bg-gradient-to-r from-primary to-primary/80 px-6 py-5 text-white">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-lg font-bold">
                {initials}
              </div>
              <div>
                <h1 className="text-xl font-bold">Profil Peserta</h1>
                <p className="text-sm text-white/85">Informasi akun login Anda</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 px-6 py-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Nama
                </p>
                <p className="mt-2 text-base font-semibold text-gray-900">
                  {profile.name}
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Username / NISN
                </p>
                <p className="mt-2 text-base font-semibold text-gray-900">
                  {profile.username || "-"}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-primary/10 bg-primary/5 p-4 text-sm text-gray-700">
              Nama profil di navbar menggunakan nama peserta. Jika nama terlalu panjang, navbar akan menampilkan inisial.
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                className="h-11 rounded-xl px-5"
                onClick={() => router.push("/form-pendaftaran")}
              >
                <span>Form Pendaftaran</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-xl px-5"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
