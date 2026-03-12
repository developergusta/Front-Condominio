"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { VoteTopicResponse } from "@/types";
import { topicService } from "@/lib/api/topic.service";
import { useAuth } from "@/components/providers/AuthProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Loader2, Plus, Clock, CheckCircle2 } from "lucide-react";

export default function TopicsList() {
  const { condominiumId, residentId, role } = useAuth();
  const [topics, setTopics] = useState<VoteTopicResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const data = await topicService.getAll();
        // Filter by the current user's condo
        setTopics(data.filter(t => t.condominiumId === condominiumId));
      } catch (err: any) {
        setError("Falha ao carregar os tópicos");
      } finally {
        setIsLoading(false);
      }
    };

    if (condominiumId) {
      fetchTopics();
    }
  }, [condominiumId]);

  const adminOpenTopics = topics.filter(t => t.createdByResidentId === residentId && t.status === 'Open').length;
  const canCreateTopic = role === 'Admin' && adminOpenTopics < 2;

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Tópicos de Votação</h2>
          <p className="text-slate-500 mt-1">Gerencie e vote em tópicos ativos.</p>
        </div>
        
        {role === 'Admin' && (
          canCreateTopic ? (
            <Link href="/topics/new">
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" /> Criar Tópico
              </Button>
            </Link>
          ) : (
            <Button className="flex items-center gap-2" disabled title="Você já possui 2 tópicos em aberto">
              <Plus className="h-4 w-4" /> Criar Tópico
            </Button>
          )
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-md border border-red-200 mb-6">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : topics.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-medium text-slate-900">Nenhum tópico encontrado</h3>
          <p className="text-slate-500 mt-2">Comece criando um novo tópico de votação.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic) => (
            <Link key={topic.id} href={`/topics/${topic.id}`} className="block transition-transform hover:-translate-y-1">
              <Card className="h-full hover:border-blue-300">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg line-clamp-1">{topic.title}</CardTitle>
                    {topic.status === 'Open' ? (
                      <span className="flex items-center gap-1 text-xs font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded-full">
                        <Clock className="w-3 h-3" /> Aberto
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-medium text-slate-700 bg-slate-100 px-2 py-1 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> Fechado
                      </span>
                    )}
                  </div>
                  <CardDescription className="line-clamp-2 mt-2">{topic.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-slate-500 flex flex-col gap-1">
                    <span>Termina: {format(new Date(topic.votingEnd), "d MMM yyyy HH:mm")}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </MainLayout>
  );
}
