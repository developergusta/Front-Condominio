"use client";

import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { condominiumService } from "@/lib/api/condominium.service";
import { Loader2, Save, Mail, FileText, Settings2 } from "lucide-react";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const { condominiumId, role } = useAuth();

  const [contactEmail, setContactEmail] = useState("");
  const [rulesText, setRulesText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  if (role !== 'Admin') {
    return (
      <MainLayout>
        <div className="p-5 bg-red-50 text-red-600 rounded-xl border border-red-200 text-sm">
          Acesso Negado: Esta página é restrita ao Síndico.
        </div>
      </MainLayout>
    );
  }

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

  return (
    <MainLayout>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="mb-8">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-1">Administração</p>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Configurações</h2>
          <p className="text-slate-500 mt-1 text-sm">Gerencie os dados e regras do seu condomínio.</p>
        </div>

        <div className="max-w-2xl">
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

            {/* Contact section */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-5">
                <Mail className="h-4 w-4 text-blue-600" />
                <h3 className="font-bold text-slate-900">Contato</h3>
              </div>
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
                <p className="text-xs text-slate-400">Este e-mail será o contato principal da administração.</p>
              </div>
            </div>

            {/* Rules section */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-5">
                <FileText className="h-4 w-4 text-blue-600" />
                <h3 className="font-bold text-slate-900">Regulamento Interno</h3>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="rulesText" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Regras Internas
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

            <Button type="submit" className="gap-2 shadow-md shadow-blue-200" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Salvar Alterações
            </Button>
          </form>
        </div>
      </motion.div>
    </MainLayout>
  );
}
