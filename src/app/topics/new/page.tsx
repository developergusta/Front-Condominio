"use client";

import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { useAuth } from "@/components/providers/AuthProvider";
import { topicService } from "@/lib/api/topic.service";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";

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
    defaultValues: {
      votingStart: defaultStart,
      votingEnd: defaultEnd,
    }
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
      <div className="mb-6">
        <Link href="/topics" className="text-sm text-blue-600 hover:underline flex items-center gap-1 mb-4">
          <ArrowLeft className="w-4 h-4" /> Voltar para Tópicos
        </Link>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Criar Novo Tópico</h2>
      </div>

      <Card className="max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Detalhes do Tópico</CardTitle>
            <CardDescription>Insira os detalhes para o novo tópico de votação.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-md border border-red-200 text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input id="title" {...register("title")} />
              {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea id="description" {...register("description")} />
              {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="votingStart">Inicia em</Label>
                <Input id="votingStart" type="datetime-local" {...register("votingStart")} />
                {errors.votingStart && <p className="text-xs text-red-500">{errors.votingStart.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="votingEnd">Termina em</Label>
                <Input id="votingEnd" type="datetime-local" {...register("votingEnd")} />
                {errors.votingEnd && <p className="text-xs text-red-500">{errors.votingEnd.message}</p>}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Publicar Tópico
            </Button>
          </CardFooter>
        </form>
      </Card>
    </MainLayout>
  );
}
