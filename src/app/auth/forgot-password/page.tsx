"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { authService } from "@/lib/api/auth.service";
import { Building2, Loader2, Mail, ArrowRight, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await authService.forgotPassword({ email });
      setSuccess(true);
      // Automatically redirecting to reset page with token
      // In a real app, this would be via email, but as requested:
      // "redirecionar o usuário para uma tela de 'Nova Senha', passando esse token"
      setTimeout(() => {
        router.push("/setup");
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Falha ao solicitar recuperação de senha.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-900/50">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-slate-900 tracking-tight">Unanime</span>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
          <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Recuperar Senha</h1>
          <p className="text-sm text-slate-500 mb-8">
            Insira seu e-mail para receber um link de recuperação.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 bg-red-50 text-red-600 rounded-lg border border-red-200 text-sm">
                {error}
              </motion.div>
            )}

            {success && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200 text-sm">
                Token gerado com sucesso! Redirecionando...
              </motion.div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                E-mail
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  className="pl-9"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700 gap-2 mt-2 font-semibold" disabled={isLoading || success}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Solicitar Token <ArrowRight className="h-4 w-4" /></>}
            </Button>

            <Link href="/setup" className="flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors pt-4">
              <ArrowLeft className="h-4 w-4" /> Voltar para o login
            </Link>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
