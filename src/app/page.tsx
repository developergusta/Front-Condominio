"use client";

import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/components/providers/AuthProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Building2, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function Home() {
  const { condominiumId, residentId } = useAuth();

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Painel de Controle</h2>
          <p className="text-slate-500 mt-2">Bem-vindo à sua plataforma digital do condomínio.</p>
        </div>

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

        <div className="mt-8 flex gap-4">
          <Link href="/topics">
            <Button size="lg">Ver Tópicos Abertos</Button>
          </Link>
          <Link href="/topics/new">
            <Button size="lg" variant="outline">Criar Novo Tópico</Button>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
