"use client";

import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/components/providers/AuthProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { condominiumService } from "@/lib/api/condominium.service";
import { Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { condominiumId, role } = useAuth();
  const router = useRouter();

  const [contactEmail, setContactEmail] = useState("");
  const [rulesText, setRulesText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  if (role !== 'Admin') {
    return (
      <MainLayout>
        <div className="p-4 bg-red-50 text-red-600 rounded-md border border-red-200">
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
      setSuccess("Configurações do condomínio atualizadas com sucesso!");
    } catch (err: any) {
      setError(err.message || "Falha ao salvar as configurações");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Configurações</h2>
        <p className="text-slate-500 mt-1">Gerencie os dados e regras do seu condomínio.</p>
      </div>

      <Card className="max-w-2xl shadow-sm">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Painel do Síndico</CardTitle>
            <CardDescription>Atualize informações de contato e o regulamento interno.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">{error}</div>}
            {success && <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-md text-sm">{success}</div>}

            <div className="space-y-2">
              <Label htmlFor="contactEmail">E-mail de Contato Oficial</Label>
              <Input 
                id="contactEmail" 
                type="email" 
                placeholder="sindico@condominio.com"
                value={contactEmail} 
                onChange={e => setContactEmail(e.target.value)} 
                required 
              />
              <p className="text-xs text-slate-500">Este e-mail será visível como o contato principal da administração.</p>
            </div>

            <div className="space-y-2 pt-2">
              <Label htmlFor="rulesText">Regras Internas (Regulamento)</Label>
              <Textarea 
                id="rulesText" 
                className="min-h-[150px]"
                placeholder="Insira as regras do condomínio aqui..."
                value={rulesText} 
                onChange={e => setRulesText(e.target.value)} 
                required 
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Salvar Alterações
            </Button>
          </CardFooter>
        </form>
      </Card>
    </MainLayout>
  );
}
