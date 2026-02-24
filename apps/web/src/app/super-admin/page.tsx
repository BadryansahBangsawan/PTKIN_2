"use client";

import { useEffect, useMemo, useState } from "react";
import { RefreshCw, Shield, Trash2, UserRound } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type AdminUser = {
  id: number;
  nisn: string;
  nama: string;
  email: string;
  telpon: string;
  username: string;
  createdAt: string | null;
};

type AdminUsersResponse =
  | {
      ok: true;
      users: AdminUser[];
    }
  | {
      ok: false;
      message: string;
    };

type DeleteUserResponse =
  | {
      ok: true;
      message: string;
      user: Pick<AdminUser, "id" | "nama" | "nisn">;
    }
  | {
      ok: false;
      message: string;
    };

function formatDateTime(value: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function SuperAdminPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [feedback, setFeedback] = useState<{
    type: "success" | "error" | "warning";
    title: string;
    message: string;
  } | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/super-admin/users", {
        cache: "no-store",
      });
      const result = (await response.json()) as AdminUsersResponse;

      if (!response.ok || !result.ok) {
        setFeedback({
          type: "error",
          title: "Gagal memuat user",
          message: result.ok ? "Terjadi kesalahan." : result.message,
        });
        return;
      }

      setUsers(result.users);
      setFeedback(null);
    } catch (error) {
      console.error(error);
      setFeedback({
        type: "error",
        title: "Gagal memuat user",
        message: "Tidak bisa menghubungi server.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;

    return users.filter((user) =>
      [user.nama, user.nisn, user.username, user.email, user.telpon]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(q)),
    );
  }, [users, search]);

  const latestUser = users[0] ?? null;

  const deleteUser = async (user: AdminUser) => {
    if (deletingId) return;

    const confirmed = window.confirm(
      `Hapus user ini?\n\nNama: ${user.nama}\nNISN: ${user.nisn}\nEmail: ${user.email}`,
    );
    if (!confirmed) return;

    setDeletingId(user.id);
    setFeedback(null);

    try {
      const response = await fetch("/api/super-admin/users", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: user.id }),
      });

      const result = (await response.json()) as DeleteUserResponse;
      if (!response.ok || !result.ok) {
        setFeedback({
          type: "error",
          title: "Gagal menghapus user",
          message: result.ok ? "Terjadi kesalahan." : result.message,
        });
        return;
      }

      setUsers((prev) => prev.filter((item) => item.id !== user.id));
      setFeedback({
        type: "success",
        title: "User dihapus",
        message: result.message,
      });
    } catch (error) {
      console.error(error);
      setFeedback({
        type: "error",
        title: "Gagal menghapus user",
        message: "Tidak bisa menghubungi server.",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-primary/5 via-background to-primary/5 px-4 py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <Card className="rounded-2xl border-0 shadow-2xl">
          <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-5 text-white">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Super Admin (Sementara)</h1>
                  <p className="text-sm text-white/85">
                    Kelola user registrasi dan hapus user dari database
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => void fetchUsers()}
                  disabled={isLoading}
                  className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>

                {latestUser ? (
                  <Button
                    type="button"
                    onClick={() => void deleteUser(latestUser)}
                    disabled={deletingId !== null}
                    className="bg-red-600 text-white hover:bg-red-700"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Hapus User Terbaru
                  </Button>
                ) : null}
              </div>
            </div>
          </div>

          <CardContent className="space-y-5 px-6 py-6">
            <Alert variant="warning">
              <AlertTitle>Catatan</AlertTitle>
              <AlertDescription>
                Halaman ini sementara dan sederhana. Urutan user terbaru saat ini berdasarkan waktu{" "}
                <code>created_at</code> (registrasi), bukan histori login.
              </AlertDescription>
            </Alert>

            {feedback ? (
              <Alert
                variant={
                  feedback.type === "success"
                    ? "success"
                    : feedback.type === "warning"
                      ? "warning"
                      : "destructive"
                }
              >
                <AlertTitle>{feedback.title}</AlertTitle>
                <AlertDescription>{feedback.message}</AlertDescription>
              </Alert>
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-gray-600">
                Total user: <span className="font-semibold text-gray-900">{users.length}</span>
                {" | "}
                Tampil: <span className="font-semibold text-gray-900">{filteredUsers.length}</span>
              </div>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama / NISN / email / username"
                className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-2 text-sm focus:border-primary focus:outline-none sm:max-w-sm"
              />
            </div>

            {isLoading ? (
              <div className="rounded-xl border border-dashed border-gray-300 bg-white px-4 py-8 text-center text-sm text-gray-600">
                Memuat daftar user...
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 bg-white px-4 py-8 text-center text-sm text-gray-600">
                Tidak ada user yang cocok.
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredUsers.map((user, index) => (
                  <div
                    key={user.id}
                    className={`rounded-xl border bg-white p-4 shadow-sm transition-colors ${
                      index === 0 && search.trim() === ""
                        ? "border-primary/30 ring-1 ring-primary/10"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <UserRound className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm font-semibold text-gray-900">{user.nama}</p>
                            {index === 0 && search.trim() === "" ? (
                              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                                Terbaru
                              </span>
                            ) : null}
                          </div>
                          <p className="text-xs text-gray-600">
                            NISN: <span className="font-medium text-gray-800">{user.nisn}</span>
                            {" • "}
                            Username:{" "}
                            <span className="font-medium text-gray-800">{user.username}</span>
                          </p>
                          <p className="text-xs text-gray-600">
                            Email: <span className="font-medium text-gray-800">{user.email}</span>
                          </p>
                          <p className="text-xs text-gray-600">
                            Telp: <span className="font-medium text-gray-800">{user.telpon}</span>
                          </p>
                          <p className="text-xs text-gray-500">
                            Registrasi: {formatDateTime(user.createdAt)}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => void deleteUser(user)}
                          disabled={deletingId !== null}
                          className="rounded-xl"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          {deletingId === user.id ? "Menghapus..." : "Hapus"}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
