"use client";

import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { condominiumService } from "@/lib/api/condominium.service";
import { Loader2, Save, Mail, FileText, Settings2, KeyRound, CheckCircle2, Shield } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

import { authService } from "@/lib/api/auth.service";

export default function SettingsPage() {
  const { condominiumId, role } = useAuth();

  // Condominium settings (Admin only)
  const [contactEmail, setContactEmail] = useState("");
  const [rulesText, setRulesText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Password change settings (All users)
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!condominiumId) return;
    setIsSubmitting(true);
    setError("");
    setSuccess("");
    try {
      await condominiumService.update(condominiumId, { contactEmail, rulesText });
      setSuccess("Configurações atualizadas com sucesso!");
    } catch (err: any) {
      setError(err.message || "Falha ao salvar as configurações");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChangingPassword(true);
    setPasswordError("");
    setPasswordSuccess("");
    try {
      await authService.changePassword({ currentPassword, newPassword });
      setPasswordSuccess("Senha alterada com sucesso!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: any) {
      setPasswordError(err.message || "Falha ao alterar a senha.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <MainLayout>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="mb-8">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-1">Configurações</p>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Sua Conta</h2>
          <p className="text-slate-500 mt-1 text-sm">Gerencie seus dados e segurança.</p>
        </div>

        <div className="max-w-2xl space-y-8">
          {/* Password Change Section (Available to everyone) */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5">
              <KeyRound className="h-4 w-4 text-blue-600" />
              <h3 className="font-bold text-slate-900">Segurança</h3>
            </div>
            
            <form onSubmit={handleChangePassword} className="space-y-4">
              {passwordError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
                  {passwordError}
                </div>
              )}
              {passwordSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" /> {passwordSuccess}
                </div>
              )}
              
              <div className="space-y-1.5">
                <Label htmlFor="currentPassword">Senha Atual</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-1.5">
                <Label htmlFor="newPassword">Nova Senha</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                />
              </div>
              
              <Button type="submit" disabled={isChangingPassword}>
                {isChangingPassword ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Shield className="h-4 w-4 mr-2" />}
                Alterar Senha
              </Button>
            </form>
          </div>

          {/* Condominium section (only for Admins) */}
          {role === 'Admin' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
                  {error}
                </motion.div>
              )}
              {success && (
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm flex items-center gap-2">
                  <Save className="h-4 w-4" /> {success}
                </motion.div>
              )}

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-5">
                  <Settings2 className="h-4 w-4 text-blue-600" />
                  <h3 className="font-bold text-slate-900">Dados do Condomínio</h3>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="contactEmail" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      E-mail de Contato Oficial
                    </Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      placeholder="sindico@condominio.com"
                      value={contactEmail}
                      onChange={e => setContactEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <Label htmlFor="rulesText" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Regulamento Interno
                    </Label>
                    <Textarea
                      id="rulesText"
                      className="min-h-[180px]"
                      placeholder="Insira as regras do condomínio aqui..."
                      value={rulesText}
                      onChange={e => setRulesText(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" className="gap-2 shadow-md shadow-blue-200" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Salvar Dados do Condomínio
              </Button>
            </form>
          )}
        </div>
      </motion.div>
    </MainLayout>
  );
}
