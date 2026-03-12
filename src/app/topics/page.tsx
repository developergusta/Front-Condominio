"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { VoteTopicResponse } from "@/types";
import { topicService } from "@/lib/api/topic.service";
import { useAuth } from "@/components/providers/AuthProvider";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Loader2, Plus, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const stagger = { animate: { transition: { staggerChildren: 0.07 } } };
const fadeInUp = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };

export default function TopicsList() {
  const { condominiumId, residentId, role } = useAuth();
  const [topics, setTopics] = useState<VoteTopicResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const data = await topicService.getAll();
        setTopics(data.filter(t => t.condominiumId === condominiumId));
      } catch {
        setError("Falha ao carregar os tópicos");
      } finally {
        setIsLoading(false);
      }
    };
    if (condominiumId) fetchTopics();
  }, [condominiumId]);

  const adminOpenTopics = topics.filter(t => t.createdByResidentId === residentId && t.status === 'Open').length;
  const canCreateTopic = role === 'Admin' && adminOpenTopics < 2;

  return (
    <MainLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-1">Gestão</p>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Tópicos de Votação</h2>
            <p className="text-slate-500 mt-1 text-sm">Gerencie e vote em tópicos ativos.</p>
          </div>

          {role === 'Admin' && (
            canCreateTopic ? (
              <Link href="/topics/new">
                <Button className="flex items-center gap-2 shadow-md shadow-blue-200">
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
          <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-200 mb-6 text-sm">{error}</div>
        )}

        {isLoading ? (
          <div className="flex justify-center p-16">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : topics.length === 0 ? (
          <div className="text-center p-16 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-6 w-6 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Nenhum tópico encontrado</h3>
            <p className="text-slate-500 mt-2 text-sm">Comece criando um novo tópico de votação.</p>
          </div>
        ) : (
          <motion.div
            variants={stagger}
            initial="initial"
            animate="animate"
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            {topics.map((topic) => {
              const isOpen = topic.status === 'Open';
              return (
                <motion.div key={topic.id} variants={fadeInUp} transition={{ duration: 0.35 }}>
                  <Link href={`/topics/${topic.id}`} className="block h-full group">
                    <div className="h-full bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:shadow-slate-200/60 hover:border-blue-200 transition-all duration-300 overflow-hidden flex flex-col">
                      {/* Card top accent */}
                      <div className={`h-1 w-full ${isOpen ? 'bg-blue-500' : 'bg-slate-300'}`} />
                      <div className="p-5 flex flex-col flex-1">
                        <div className="flex justify-between items-start mb-3">
                          <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                            isOpen
                              ? 'text-blue-700 bg-blue-50 border border-blue-100'
                              : 'text-slate-600 bg-slate-100 border border-slate-200'
                          }`}>
                            {isOpen ? <Clock className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                            {isOpen ? 'Aberto' : 'Encerrado'}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-slate-900 line-clamp-2 mb-2 group-hover:text-blue-700 transition-colors">
                          {topic.title}
                        </h3>
                        <p className="text-sm text-slate-500 line-clamp-3 flex-1 mb-4">
                          {topic.description}
                        </p>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                          <span className="text-xs text-slate-400">
                            Encerra: {format(new Date(topic.votingEnd), "d MMM yyyy")}
                          </span>
                          <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </motion.div>
    </MainLayout>
  );
}
