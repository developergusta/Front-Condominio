"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { authService } from "@/lib/api/auth.service";
import { Building2, Loader2, KeyRound, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Token de recuperação ausente ou inválido.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await authService.resetPassword({ token, newPassword });
      setSuccess(true);
      setTimeout(() => {
        router.push("/setup");
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Falha ao definir nova senha.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 w-full max-w-md">
      <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Nova Senha</h1>
      <p className="text-sm text-slate-500 mb-8">
        Defina sua nova senha de acesso.
      </p>

      {success ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4 space-y-4">
          <div className="mx-auto w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <p className="text-emerald-700 font-medium">Senha alterada com sucesso!</p>
          <p className="text-slate-500 text-sm">Você será redirecionado para o login em instantes.</p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 bg-red-50 text-red-600 rounded-lg border border-red-200 text-sm">
              {error}
            </motion.div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Nova Senha
            </Label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                id="password"
                type="password"
                className="pl-9"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={!token}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Confirmar Nova Senha
            </Label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                id="confirmPassword"
                type="password"
                className="pl-9"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={!token}
              />
            </div>
          </div>

          <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700 gap-2 mt-2 font-semibold" disabled={isLoading || !token}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Redefinir Senha <ArrowRight className="h-4 w-4" /></>}
          </Button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full flex flex-col items-center"
      >
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-900/50">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-slate-900 tracking-tight">Unanime</span>
        </div>

        <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin text-blue-600" />}>
          <ResetPasswordForm />
        </Suspense>
      </motion.div>
    </div>
  );
}
