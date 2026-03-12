"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { VoteTopicResponse, VotingResultResponse, TopicReportResponse, TopicVoteDetailResponse } from "@/types";
import { topicService } from "@/lib/api/topic.service";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { format } from "date-fns";
import Link from "next/link";
import { Loader2, ArrowLeft, CheckCircle2, Clock, ThumbsUp, ThumbsDown, Minus, MessageSquareText, Users, BarChart2 } from "lucide-react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

const fadeInUp = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };

function AnimatedBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
      <motion.div
        className={`h-2.5 rounded-full ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </div>
  );
}

export default function TopicDetailsPage() {
  const { residentId, role } = useAuth();
  const params = useParams();
  const topicId = params.id as string;

  const [topic, setTopic] = useState<VoteTopicResponse | null>(null);
  const [results, setResults] = useState<VotingResultResponse | null>(null);
  const [votesList, setVotesList] = useState<TopicVoteDetailResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [currentVote, setCurrentVote] = useState<'Yes' | 'No' | 'Abstain' | null>(null);
  const [justification, setJustification] = useState("");
  const [report, setReport] = useState<TopicReportResponse | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadData = async () => {
    try {
      const [topicData, resultsData, hasVotedData, votesData] = await Promise.all([
        topicService.getById(topicId),
        topicService.getResults(topicId),
        topicService.hasVoted(topicId),
        topicService.getVotes(topicId).catch(() => [])
      ]);
      setTopic(topicData);
      setResults(resultsData);
      setVotesList(votesData);
      setHasVoted(hasVotedData.hasVoted);
      if (hasVotedData.currentVote) setCurrentVote(hasVotedData.currentVote);

      if (topicData.status === 'Closed') {
        const reportData = await topicService.getReport(topicId);
        setReport(reportData);
      }
    } catch {
      setError("Falha ao carregar detalhes do tópico");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (topicId && role !== undefined) loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicId, role]);

  const handleVote = async (optionNum: number) => {
    setIsVoting(true);
    setError("");
    setSuccess("");
    try {
      const optionStr = optionNum === 0 ? 'Yes' : optionNum === 1 ? 'No' : 'Abstain';
      await topicService.vote(topicId, { option: optionStr, justification: justification.trim() || undefined });
      setSuccess("Seu voto foi registrado com sucesso!");
      setHasVoted(true);
      setCurrentVote(optionStr);
      await loadData();
    } catch (err: any) {
      setError(err.message || "Falha ao registrar voto");
    } finally {
      setIsVoting(false);
    }
  };

  const getVoteText = (voteStr: string | null) => {
    switch (voteStr) {
      case 'Yes': return 'Sim';
      case 'No': return 'Não';
      case 'Abstain': return 'Abster';
      default: return '';
    }
  };

  if (isLoading) return (
    <MainLayout>
      <div className="flex justify-center p-16">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    </MainLayout>
  );

  if (!topic || !results) return (
    <MainLayout>
      <div className="p-5 bg-red-50 text-red-600 rounded-xl border border-red-200">Tópico não encontrado.</div>
    </MainLayout>
  );

  const isVotingStarted = new Date() >= new Date(topic.votingStart);
  const isOpen = topic.status === 'Open';

  return (
    <MainLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="space-y-6">
        {/* Back + Header */}
        <div>
          <Link href="/topics" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 transition-colors mb-4 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Voltar para Tópicos
          </Link>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-1">Tópico</p>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">{topic.title}</h2>
            </div>
            <span className={`shrink-0 flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full ${
              isOpen ? 'text-blue-700 bg-blue-50 border border-blue-200' : 'text-slate-600 bg-slate-100 border border-slate-200'
            }`}>
              {isOpen ? <Clock className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
              {isOpen ? 'Votação Aberta' : 'Encerrada'}
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="md:col-span-2 space-y-6">
            {/* Description Card */}
            <motion.div variants={fadeInUp} initial="initial" animate="animate" transition={{ duration: 0.4 }}>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h3 className="font-bold text-slate-900 mb-1">Descrição</h3>
                <p className="text-xs text-slate-400 mb-4">
                  Início: {format(new Date(topic.votingStart), "d MMM yyyy HH:mm")} &nbsp;•&nbsp; Término: {format(new Date(topic.votingEnd), "d MMM yyyy HH:mm")}
                </p>
                <p className="whitespace-pre-wrap text-slate-700 text-sm leading-relaxed">{topic.description}</p>
              </div>
            </motion.div>

            {/* Voting Card */}
            {isOpen && (
              <motion.div variants={fadeInUp} initial="initial" animate="animate" transition={{ duration: 0.4, delay: 0.1 }}>
                <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
                  <div className="h-1 w-full bg-blue-500" />
                  <div className="p-6">
                    <h3 className="font-bold text-slate-900 mb-0.5">Registre Seu Voto</h3>
                    <p className="text-xs text-slate-400 mb-5">Você pode alterar seu voto enquanto a votação estiver aberta.</p>

                    {error && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm mb-4">
                        {error}
                      </motion.div>
                    )}
                    {success && (
                      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-sm mb-4 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" /> {success}
                      </motion.div>
                    )}

                    {!isVotingStarted ? (
                      <div className="p-4 bg-amber-50 text-amber-800 rounded-xl border border-amber-200 text-sm text-center">
                        A votação ainda não começou.
                      </div>
                    ) : (
                      <>
                        {hasVoted && currentVote && (
                          <div className="p-3 mb-5 bg-blue-50 text-blue-800 rounded-xl border border-blue-200 text-sm text-center">
                            Seu voto atual: <span className="font-bold">{getVoteText(currentVote)}</span>
                          </div>
                        )}
                        <div className="grid grid-cols-3 gap-3 mb-5">
                          {[
                            { label: "Sim", icon: ThumbsUp, opt: 0, vote: 'Yes' as const, active: "bg-emerald-600 ring-2 ring-emerald-400 ring-offset-2 text-white", def: "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100" },
                            { label: "Não", icon: ThumbsDown, opt: 1, vote: 'No' as const, active: "bg-red-600 ring-2 ring-red-400 ring-offset-2 text-white", def: "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100" },
                            { label: "Abster", icon: Minus, opt: 2, vote: 'Abstain' as const, active: "bg-slate-700 ring-2 ring-slate-400 ring-offset-2 text-white", def: "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100" },
                          ].map((btn) => (
                            <button
                              key={btn.opt}
                              type="button"
                              onClick={() => handleVote(btn.opt)}
                              disabled={isVoting}
                              className={`flex flex-col items-center gap-2 py-4 rounded-xl font-semibold text-sm transition-all duration-200 ${currentVote === btn.vote ? btn.active : btn.def}`}
                            >
                              <btn.icon className="h-5 w-5" />
                              {btn.label}
                            </button>
                          ))}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Justificativa (Opcional)</p>
                          <Textarea
                            placeholder="Deixe um comentário sobre o seu voto..."
                            value={justification}
                            onChange={(e) => setJustification(e.target.value)}
                            className="resize-none text-sm"
                            rows={2}
                            maxLength={500}
                            disabled={isVoting}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Votes list */}
            <motion.div variants={fadeInUp} initial="initial" animate="animate" transition={{ duration: 0.4, delay: 0.2 }}>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-1">
                  <MessageSquareText className="w-4 h-4 text-blue-600" />
                  <h3 className="font-bold text-slate-900">Transparência de Votos</h3>
                </div>
                <p className="text-xs text-slate-400 mb-5">Histórico e justificativas dos condôminos.</p>

                {votesList.length === 0 ? (
                  <div className="flex flex-col items-center py-8 text-center">
                    <Users className="h-8 w-8 text-slate-200 mb-2" />
                    <p className="text-sm text-slate-400">Nenhum voto registrado ainda.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {votesList.map((vote, i) => (
                      <motion.div
                        key={vote.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="bg-slate-50 rounded-xl border border-slate-100 p-4"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold text-sm text-slate-900">{vote.residentName}</p>
                            <p className="text-xs text-slate-400">Apt {vote.residentApartment} • {format(new Date(vote.createdAt), "dd/MM/yyyy HH:mm")}</p>
                          </div>
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                            vote.option === 'Yes' ? 'bg-emerald-100 text-emerald-700' :
                            vote.option === 'No' ? 'bg-red-100 text-red-700' :
                            'bg-slate-200 text-slate-600'
                          }`}>
                            {getVoteText(vote.option)}
                          </span>
                        </div>
                        {vote.justification && (
                          <p className="text-sm text-slate-500 italic p-3 bg-white rounded-lg border border-slate-100">
                            &quot;{vote.justification}&quot;
                          </p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Results */}
            <motion.div variants={fadeInUp} initial="initial" animate="animate" transition={{ duration: 0.4, delay: 0.05 }}>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-1">
                  <BarChart2 className="w-4 h-4 text-blue-600" />
                  <h3 className="font-bold text-slate-900">Resultados Atuais</h3>
                </div>
                <p className="text-xs text-slate-400 mb-6">{results.totalVotes} voto{results.totalVotes !== 1 ? 's' : ''} registrado{results.totalVotes !== 1 ? 's' : ''}</p>

                <div className="space-y-5">
                  {[
                    { label: "Sim", count: results.yesVotes, color: "bg-emerald-500", textColor: "text-emerald-700" },
                    { label: "Não", count: results.noVotes, color: "bg-red-500", textColor: "text-red-700" },
                    { label: "Abstenções", count: results.abstainVotes, color: "bg-slate-400", textColor: "text-slate-600" },
                  ].map((r) => (
                    <div key={r.label}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className={`font-semibold ${r.textColor}`}>{r.label}</span>
                        <span className="text-slate-500 font-medium">{r.count}</span>
                      </div>
                      <AnimatedBar value={r.count} max={results.totalVotes} color={r.color} />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Admin report */}
            {report && (
              <motion.div variants={fadeInUp} initial="initial" animate="animate" transition={{ duration: 0.4, delay: 0.15 }}>
                <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
                  <div className="h-1 w-full bg-blue-500" />
                  <div className="p-6">
                    <h3 className="font-bold text-slate-900 mb-0.5">Relatório Consolidado</h3>
                    <p className="text-xs text-slate-400 mb-5">Auditoria consolidada da votação</p>
                    <div className="space-y-3 text-sm">
                      {[
                        { label: "ID do Tópico", value: `${report.topicId.split('-')[0]}...`, mono: true },
                        { label: "Status Final", value: report.status },
                        { label: "Total de Votos", value: String(report.totalVotes), bold: true },
                      ].map((item) => (
                        <div key={item.label} className="flex justify-between items-center pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                          <span className="text-slate-500">{item.label}</span>
                          <span className={`${item.mono ? 'font-mono text-xs' : ''} ${item.bold ? 'font-bold' : 'font-medium'} text-slate-900`}>{item.value}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-5 bg-slate-50 rounded-xl p-4 border border-slate-100">
                      <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">Apuramento Oficial</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-emerald-700">Sim</span><strong className="text-emerald-700">{report.yesVotes}</strong></div>
                        <div className="flex justify-between"><span className="text-red-700">Não</span><strong className="text-red-700">{report.noVotes}</strong></div>
                        <div className="flex justify-between"><span className="text-slate-600">Abstenções</span><strong className="text-slate-600">{report.abstainVotes}</strong></div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </MainLayout>
  );
}
