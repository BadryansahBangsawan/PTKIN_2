"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { LogIn, User, Lock, X } from "lucide-react";
import { useModalContext } from "@/contexts/modal-context";
import { loginWithPassword } from "@/lib/login-auth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export function LoginModal() {
  const router = useRouter();
  const { showLoginModal, setShowLoginModal } = useModalContext();
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    const result = await loginWithPassword(loginData);
    if (!result.ok) {
      setErrorMessage(result.message);
      setIsSubmitting(false);
      return;
    }

    console.log("Login success:", result.user.username);
    setShowLoginModal(false);
    setLoginData({ username: "", password: "" });
    if (typeof document !== "undefined") {
      document.cookie = "umptkin_login=1; path=/; max-age=86400";
      document.cookie = `umptkin_user=${encodeURIComponent(result.user.username)}; path=/; max-age=86400`;
      document.cookie = `umptkin_name=${encodeURIComponent(result.user.nama)}; path=/; max-age=86400`;
      window.dispatchEvent(new Event("umptkin-auth-changed"));
    }
    setIsSubmitting(false);
    router.push("/form-pendaftaran");
  };

  return (
    <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
      <DialogContent className="max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-5 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                <LogIn className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Login Peserta</h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowLoginModal(false)}
              className="text-white/80 hover:text-white hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <form onSubmit={handleLoginSubmit} className="p-6 space-y-5">
          {errorMessage ? (
            <Alert variant="destructive">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          ) : null}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              Username / NISN <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={loginData.username}
                onChange={(e) =>
                  setLoginData({ ...loginData, username: e.target.value })
                }
                className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 pl-10 text-sm focus:border-primary focus:bg-white focus:outline-none transition-colors"
                placeholder="Masukkan username atau NISN"
              />
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Lock className="h-4 w-4 text-primary" />
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 pl-10 text-sm focus:border-primary focus:bg-white focus:outline-none transition-colors"
                placeholder="Masukkan password"
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-12 rounded-xl border-2 text-sm font-semibold hover:bg-gray-50 transition-colors"
              onClick={() => setShowLoginModal(false)}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-12 rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white text-sm font-semibold shadow-lg shadow-primary/25 transition-all hover:shadow-xl"
            >
              {isSubmitting ? "Masuk..." : "Login"}
            </Button>
          </div>
          <div className="text-center pt-2">
            <a href="#" className="text-sm text-primary hover:text-primary/80 hover:underline underline-offset-4 transition-all">
              Lupa Password?
            </a>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
