"use client";

import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { useAuth } from "@/components/providers/AuthProvider";
import { topicService } from "@/lib/api/topic.service";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, FileText, Calendar } from "lucide-react";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { motion } from "framer-motion";

const createTopicSchema = z.object({
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres").max(200),
  description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres").max(1000),
  votingStart: z.string(),
  votingEnd: z.string(),
}).refine(data => new Date(data.votingEnd) > new Date(data.votingStart), {
  message: "O horário de término deve ser após o de início",
  path: ["votingEnd"],
});

type CreateTopicForm = z.infer<typeof createTopicSchema>;

export default function NewTopicPage() {
  const { condominiumId, residentId } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");

  const now = new Date();
  const defaultStart = format(now, "yyyy-MM-dd'T'HH:mm");
  const defaultEnd = format(new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), "yyyy-MM-dd'T'HH:mm");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CreateTopicForm>({
    resolver: zodResolver(createTopicSchema),
    defaultValues: { votingStart: defaultStart, votingEnd: defaultEnd },
  });

  const onSubmit = async (data: CreateTopicForm) => {
    if (!condominiumId || !residentId) return;
    setError("");
    try {
      const response = await topicService.create({
        title: data.title,
        description: data.description,
        votingStart: new Date(data.votingStart).toISOString(),
        votingEnd: new Date(data.votingEnd).toISOString(),
      });
      router.push(`/topics/${response.id}`);
    } catch (err: any) {
      setError(err.message || "Falha ao criar tópico");
    }
  };

  return (
    <MainLayout>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="mb-8">
          <Link href="/topics" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 transition-colors mb-4 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Voltar para Tópicos
          </Link>
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-1">Administração</p>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Criar Novo Tópico</h2>
          <p className="text-slate-500 mt-1 text-sm">Preencha os detalhes para iniciar uma votação no condomínio.</p>
        </div>

        <div className="max-w-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 bg-red-50 text-red-600 rounded-xl border border-red-200 text-sm">
                {error}
              </motion.div>
            )}

            {/* Title */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-5">
                <FileText className="h-4 w-4 text-blue-600" />
                <h3 className="font-bold text-slate-900">Conteúdo</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="title" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Título</Label>
                  <Input id="title" placeholder="Ex.: Reforma da fachada do condomínio" {...register("title")} />
                  {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="description" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Descrição</Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva o tópico em detalhes para que os moradores possam tomar uma decisão informada..."
                    className="min-h-[120px]"
                    {...register("description")}
                  />
                  {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-5">
                <Calendar className="h-4 w-4 text-blue-600" />
                <h3 className="font-bold text-slate-900">Período de Votação</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="votingStart" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Inicia em</Label>
                  <Input id="votingStart" type="datetime-local" {...register("votingStart")} />
                  {errors.votingStart && <p className="text-xs text-red-500">{errors.votingStart.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="votingEnd" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Termina em</Label>
                  <Input id="votingEnd" type="datetime-local" {...register("votingEnd")} />
                  {errors.votingEnd && <p className="text-xs text-red-500">{errors.votingEnd.message}</p>}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={isSubmitting} className="gap-2 shadow-md shadow-blue-200">
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Publicar Tópico
              </Button>
              <Link href="/topics">
                <Button type="button" variant="outline">Cancelar</Button>
              </Link>
            </div>
          </form>
        </div>
      </motion.div>
    </MainLayout>
  );
}
