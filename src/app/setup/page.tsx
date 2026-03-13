"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { authService } from "@/lib/api/auth.service";
import { condominiumService } from "@/lib/api/condominium.service";
import {
  Building2,
  Loader2,
  KeyRound,
  Mail,
  User,
  Hash,
  ArrowRight,
  CheckCircle2,
  Shield,
  Users,
} from "lucide-react";
import { CondominiumResponse } from "@/types";
import { motion } from "framer-motion";

const features = [
  { icon: CheckCircle2, text: "Votação digital 100% segura" },
  { icon: Shield, text: "Dados criptografados e auditáveis" },
  { icon: Users, text: "Gestão centralizada de moradores" },
];

export default function SetupPage() {
  const { login } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [condos, setCondos] = useState<CondominiumResponse[]>([]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [apartmentNumber, setApartmentNumber] = useState("");
  const [condominiumId, setCondominiumId] = useState("");

  useEffect(() => {
    if (!isLoginMode && condos.length === 0) {
      condominiumService.getAll().then(setCondos).catch(console.error);
    }
  }, [isLoginMode, condos.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      let result;
      if (isLoginMode) {
        result = await authService.login({ email, password });
      } else {
        if (!condominiumId)
          throw new Error("Por favor, selecione um condomínio");
        result = await authService.register({
          name,
          email,
          password,
          apartmentNumber,
          condominiumId,
        });
      }
      login(result.token, result.condominiumId, result.residentId, result.name);
    } catch (err: any) {
      setError(err.message || "Falha na autenticação. Verifique os dados.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/15 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 flex items-center gap-2.5">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-900/50">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">
            Unanime
          </span>
        </div>

        <div className="relative z-10">
          <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">
            Seu condomínio no controle digital.
          </h2>
          <p className="text-slate-400 text-base mb-10 leading-relaxed">
            Decisões transparentes, votações seguras e comunicação centralizada
            para toda a comunidade.
          </p>
          <ul className="space-y-4">
            {features.map((f, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.15 }}
                className="flex items-center gap-3 text-slate-300"
              >
                <div className="p-1.5 bg-blue-600/20 rounded-lg">
                  <f.icon className="h-4 w-4 text-blue-400" />
                </div>
                <span className="text-sm font-medium">{f.text}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-slate-600 text-xs">
          © 2026 Unanime Tecnologias
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">
              Unanime
            </span>
          </div>

          <h1 className="text-2xl font-extrabold text-slate-900 mb-1">
            {isLoginMode ? "Bem-vindo de volta" : "Criar sua conta"}
          </h1>
          <p className="text-sm text-slate-500 mb-8">
            {isLoginMode
              ? "Entre com seu e-mail e senha para continuar."
              : "Preencha os dados para se registrar."}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-50 text-red-600 rounded-lg border border-red-200 text-sm"
              >
                {error}
              </motion.div>
            )}

            {!isLoginMode && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-4"
              >
                <div className="space-y-1.5">
                  <Label
                    htmlFor="name"
                    className="text-xs font-semibold text-slate-700 uppercase tracking-wider"
                  >
                    Seu Nome
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                      id="name"
                      className="pl-9"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="condoId"
                    className="text-xs font-semibold text-slate-700 uppercase tracking-wider"
                  >
                    Condomínio
                  </Label>
                  <select
                    id="condoId"
                    value={condominiumId}
                    onChange={(e) => setCondominiumId(e.target.value)}
                    required
                    className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="" disabled>
                      Selecione seu condomínio...
                    </option>
                    {condos.map((condo) => (
                      <option key={condo.id} value={condo.id}>
                        {condo.name} ({condo.address})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="apt"
                    className="text-xs font-semibold text-slate-700 uppercase tracking-wider"
                  >
                    Número do Apartamento / Bloco
                  </Label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                      id="apt"
                      className="pl-9"
                      value={apartmentNumber}
                      onChange={(e) => setApartmentNumber(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </motion.div>
            )}

            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="text-xs font-semibold text-slate-700 uppercase tracking-wider"
              >
                E-mail
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  className="pl-9"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="password"
                className="text-xs font-semibold text-slate-700 uppercase tracking-wider"
              >
                Senha
              </Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  className="pl-9"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 gap-2 mt-2 font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  {isLoginMode ? "Entrar" : "Criar Conta"}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>

            <p className="text-center text-sm text-slate-500 pt-2">
              {isLoginMode ? "Não tem conta?" : "Já tem uma conta?"}
              {"  "}
              <button
                type="button"
                onClick={() => {
                  setIsLoginMode(!isLoginMode);
                  setError("");
                }}
                className="text-blue-600 hover:underline font-semibold"
              >
                {isLoginMode ? "Cadastre-se" : "Entre aqui"}
              </button>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
