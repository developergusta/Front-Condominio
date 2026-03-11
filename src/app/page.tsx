"use client";

import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/components/providers/AuthProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Building2, Users, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useEffect, useState } from "react";
import { condominiumService } from "@/lib/api/condominium.service";
import { CondominiumDashboardResponse } from "@/types";

export default function Home() {
  const { condominiumId, residentId, role, name } = useAuth();
  const [dashboard, setDashboard] = useState<CondominiumDashboardResponse | null>(null);
  
  useEffect(() => {
    if (role === 'Admin' && condominiumId) {
      condominiumService.getDashboard(condominiumId)
        .then(setDashboard)
        .catch(console.error);
    }
  }, [role, condominiumId]);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Olá, {name || 'Morador'}!</h2>
          <p className="text-slate-500 mt-2">
            Bem-vindo à sua plataforma digital do condomínio. {role === 'Admin' && <span className="text-blue-600 font-medium ml-1">(Visão do Síndico)</span>}
          </p>
        </div>

        {role === 'Admin' && dashboard ? (
          <div className="grid gap-4 md:grid-cols-3">
             <Card>
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                 <CardTitle className="text-sm font-medium">Total de Moradores</CardTitle>
                 <Users className="h-4 w-4 text-blue-500" />
               </CardHeader>
               <CardContent>
                 <div className="text-2xl font-bold">{dashboard.totalResidents}</div>
               </CardContent>
             </Card>
             <Card>
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                 <CardTitle className="text-sm font-medium">Tópicos Abertos</CardTitle>
                 <AlertCircle className="h-4 w-4 text-emerald-500" />
               </CardHeader>
               <CardContent>
                 <div className="text-2xl font-bold">{dashboard.openTopics}</div>
               </CardContent>
             </Card>
             <Card>
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                 <CardTitle className="text-sm font-medium">Tópicos Encerrados</CardTitle>
                 <CheckCircle2 className="h-4 w-4 text-slate-500" />
               </CardHeader>
               <CardContent>
                 <div className="text-2xl font-bold">{dashboard.closedTopics}</div>
               </CardContent>
             </Card>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Informação da Sessão</CardTitle>
                <Users className="h-4 w-4 text-slate-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Ativa</div>
                <p className="text-xs text-slate-500 mt-2">ID do Morador: {residentId?.split('-')[0]}...</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Condomínio</CardTitle>
                <Building2 className="h-4 w-4 text-slate-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Conectado</div>
                <p className="text-xs text-slate-500 mt-2">ID do Condomínio: {condominiumId?.split('-')[0]}...</p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="mt-8 flex gap-4">
          <Link href="/topics">
            <Button size="lg">Ver Tópicos Abertos</Button>
          </Link>
          {role === 'Admin' && (
            <Link href="/topics/new">
              <Button size="lg" variant="outline">Criar Novo Tópico</Button>
            </Link>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
