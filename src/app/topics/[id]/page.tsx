"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { VoteTopicResponse, VotingResultResponse } from "@/types";
import { topicService } from "@/lib/api/topic.service";
import { useAuth } from "@/components/providers/AuthProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { format } from "date-fns";
import Link from "next/link";
import { Loader2, ArrowLeft, CheckCircle2, Clock, ThumbsUp, ThumbsDown, Minus } from "lucide-react";
import { useParams } from "next/navigation";

export default function TopicDetailsPage() {
  const { residentId } = useAuth();
  const params = useParams();
  const topicId = params.id as string;

  const [topic, setTopic] = useState<VoteTopicResponse | null>(null);
  const [results, setResults] = useState<VotingResultResponse | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [currentVote, setCurrentVote] = useState<'Yes' | 'No' | 'Abstain' | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadData = async () => {
    try {
      const [topicData, resultsData, hasVotedData] = await Promise.all([
        topicService.getById(topicId),
        topicService.getResults(topicId),
        topicService.hasVoted(topicId)
      ]);
      setTopic(topicData);
      setResults(resultsData);
      setHasVoted(hasVotedData.hasVoted);
      if (hasVotedData.currentVote) {
        setCurrentVote(hasVotedData.currentVote);
      }
    } catch (err: any) {
      setError("Falha ao carregar detalhes do tópico");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (topicId) loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicId]);

  const handleVote = async (option: number) => {
    setIsVoting(true);
    setError("");
    setSuccess("");

    try {
      await topicService.vote(topicId, { option });
      setSuccess("Seu voto foi registrado com sucesso!");
      setHasVoted(true);
      setCurrentVote(option === 0 ? 'Yes' : option === 1 ? 'No' : 'Abstain');
      // Reload results
      await loadData();
    } catch (err: any) {
      setError(err.message || "Falha ao registrar voto");
    } finally {
      setIsVoting(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </MainLayout>
    );
  }

  if (!topic || !results) {
    return (
      <MainLayout>
        <div className="p-4 bg-red-50 text-red-600 rounded-md">Tópico não encontrado.</div>
      </MainLayout>
    );
  }

  const isVotingStarted = new Date() >= new Date(topic.votingStart);
  
  const getVoteText = (voteStr: string | null) => {
    switch (voteStr) {
      case 'Yes': return 'Sim';
      case 'No': return 'Não';
      case 'Abstain': return 'Abster';
      default: return '';
    }
  };

  return (
    <MainLayout>
      <div className="mb-6">
        <Link href="/topics" className="text-sm text-blue-600 hover:underline flex items-center gap-1 mb-4">
          <ArrowLeft className="w-4 h-4" /> Voltar para Tópicos
        </Link>
        <div className="flex justify-between items-start">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">{topic.title}</h2>
          {topic.status === 'Open' ? (
            <span className="flex items-center gap-1 text-sm font-medium text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full">
              <Clock className="w-4 h-4" /> Votação Aberta
            </span>
          ) : (
            <span className="flex items-center gap-1 text-sm font-medium text-slate-700 bg-slate-100 px-3 py-1.5 rounded-full">
              <CheckCircle2 className="w-4 h-4" /> Votação Encerrada
            </span>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Column: Details & Voting */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Descrição</CardTitle>
              <CardDescription>
                Início: {format(new Date(topic.votingStart), "d MMM yyyy HH:mm")} <br/>
                Término: {format(new Date(topic.votingEnd), "d MMM yyyy HH:mm")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-slate-700">{topic.description}</p>
            </CardContent>
          </Card>

          {topic.status === 'Open' && (
            <Card className="border-blue-200 bg-blue-50/30 shadow-md">
              <CardHeader>
                <CardTitle>Registre Seu Voto</CardTitle>
                <CardDescription>Você só pode votar uma vez por tópico.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">{error}</div>}
                {success && <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-md text-sm">{success}</div>}
                
                {!isVotingStarted ? (
                   <div className="p-4 bg-yellow-50 text-yellow-800 rounded-md border border-yellow-200 text-center text-sm">
                     A votação ainda não começou.
                   </div>
                ) : (
                  <>
                    {hasVoted && currentVote && (
                       <div className="p-4 mb-4 bg-blue-50 text-blue-800 rounded-md border border-blue-200 text-center text-sm font-medium">
                         Seu voto atual é: <span className="font-bold">{getVoteText(currentVote)}</span>
                       </div>
                    )}
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button 
                        className={`flex-1 gap-2 ${currentVote === 'Yes' ? 'bg-green-700 ring-2 ring-green-400 ring-offset-2' : 'bg-green-600 hover:bg-green-700'} text-white`} 
                        onClick={() => handleVote(0)}
                        disabled={isVoting}
                      >
                        <ThumbsUp className="w-4 h-4" /> Sim
                      </Button>
                      <Button 
                        className={`flex-1 gap-2 ${currentVote === 'No' ? 'bg-red-700 ring-2 ring-red-400 ring-offset-2' : 'bg-red-600 hover:bg-red-700'} text-white`} 
                        onClick={() => handleVote(1)}
                        disabled={isVoting}
                      >
                        <ThumbsDown className="w-4 h-4" /> Não
                      </Button>
                      <Button 
                        variant={currentVote === 'Abstain' ? 'secondary' : 'outline'}
                        className={`flex-1 gap-2 ${currentVote === 'Abstain' ? 'ring-2 ring-slate-400 ring-offset-2' : ''}`} 
                        onClick={() => handleVote(2)}
                        disabled={isVoting}
                      >
                        <Minus className="w-4 h-4" /> Abster
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Live Results */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resultados Atuais</CardTitle>
              <CardDescription>{results.totalVotes} votos totais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-green-700">Sim</span>
                  <span>{results.yesVotes}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${results.totalVotes > 0 ? (results.yesVotes / results.totalVotes) * 100 : 0}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-red-700">Não</span>
                  <span>{results.noVotes}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${results.totalVotes > 0 ? (results.noVotes / results.totalVotes) * 100 : 0}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-slate-700">Absterções</span>
                  <span>{results.abstainVotes}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div className="bg-slate-400 h-2.5 rounded-full" style={{ width: `${results.totalVotes > 0 ? (results.abstainVotes / results.totalVotes) * 100 : 0}%` }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
