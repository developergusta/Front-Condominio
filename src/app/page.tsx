"use client";

import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/components/providers/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Building2, Users, FileText, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useEffect, useState } from "react";
import { condominiumService } from "@/lib/api/condominium.service";
import { topicService } from "@/lib/api/topic.service";
import { CondominiumDashboardResponse } from "@/types";
import LandingPage from "@/components/marketing/LandingPage";
import { motion } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
};

export default function Home() {
  const { isAuthenticated, condominiumId, residentId, role, name } = useAuth();
  const [dashboard, setDashboard] = useState<CondominiumDashboardResponse | null>(null);
  const [canCreateTopic, setCanCreateTopic] = useState(true);

  useEffect(() => {
    if (condominiumId) {
      if (role === 'Admin') {
        condominiumService.getDashboard(condominiumId)
          .then(setDashboard)
          .catch(console.error);
      }

      topicService.getAll().then(topics => {
        const userOpenTopics = topics.filter(t => t.createdByResidentId === residentId && t.status === 'Open').length;
        setCanCreateTopic(userOpenTopics < 2);
      }).catch(console.error);
    }
  }, [role, condominiumId, residentId]);

  if (!isAuthenticated) {
    return <LandingPage />;
  }

  const statCards = role === 'Admin' && dashboard ? [
    {
      label: "Total de Moradores",
      value: dashboard.totalResidents,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
    },
    {
      label: "Tópicos Abertos",
      value: dashboard.openTopics,
      icon: AlertCircle,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
    },
    {
      label: "Tópicos Encerrados",
      value: dashboard.closedTopics,
      icon: CheckCircle2,
      color: "text-slate-600",
      bg: "bg-slate-50",
      border: "border-slate-200",
    },
  ] : [
    {
      label: "Status da Sessão",
      value: "Ativa",
      sub: `ID: ${residentId?.split('-')[0]}...`,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
    },
    {
      label: "Condomínio",
      value: "Conectado",
      sub: `ID: ${condominiumId?.split('-')[0]}...`,
      icon: Building2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
    },
  ];

  return (
    <MainLayout>
      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        className="space-y-8"
      >
        {/* Header */}
        <motion.div variants={fadeInUp} transition={{ duration: 0.5 }}>
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-1">
            {role === 'Admin' ? 'Painel do Síndico' : 'Painel do Morador'}
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Olá, {name?.split(' ')[0] || 'Bem-vindo'}! 👋
          </h2>
          <p className="text-slate-500 mt-1 text-sm">
            Aqui está um resumo do seu condomínio.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div variants={stagger} className="grid gap-4 md:grid-cols-3">
          {statCards.map((card, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              transition={{ duration: 0.4 }}
            >
              <Card className={`border ${card.border} shadow-sm hover:shadow-md transition-shadow`}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">{card.label}</CardTitle>
                  <div className={`p-2 rounded-lg ${card.bg}`}>
                    <card.icon className={`h-4 w-4 ${card.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900">{card.value}</div>
                  {'sub' in card && card.sub && (
                    <p className="text-xs text-slate-400 mt-1 font-mono">{card.sub}</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Actions */}
        <motion.div variants={fadeInUp} transition={{ duration: 0.5 }}>
          <Card className="border border-slate-100 shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-base font-semibold text-slate-800 mb-4">Ações Rápidas</h3>
              <div className="flex flex-wrap gap-3">
                <Link href="/topics?status=Open">
                  <Button size="lg" className="gap-2">
                    <FileText className="h-4 w-4" /> Ver Tópicos Abertos
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
                {role === 'Admin' && (
                  <Link href="/topics?status=Closed">
                    <Button size="lg" variant="outline" className="gap-2 border-slate-200">
                      <CheckCircle2 className="h-4 w-4" /> Ver Tópicos Encerrados
                    </Button>
                  </Link>
                )}
                {canCreateTopic ? (
                  <Link href="/topics/new">
                    <Button size="lg" variant="outline" className="gap-2">
                      Criar Novo Tópico
                    </Button>
                  </Link>
                ) : (
                  <Button size="lg" variant="outline" disabled title="Você já possui 2 tópicos em aberto">
                    Criar Novo Tópico
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </MainLayout>
  );
}
