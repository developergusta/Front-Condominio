"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { authService } from "@/lib/api/auth.service";
import { condominiumService } from "@/lib/api/condominium.service";
import { Building2, Loader2, KeyRound } from "lucide-react";
import { CondominiumResponse } from "@/types";

export default function SetupPage() {
  const { login } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [condos, setCondos] = useState<CondominiumResponse[]>([]);

  // Form states
  const [email, setEmail] = useState("joao@example.com");
  const [password, setPassword] = useState("senha123");
  const [name, setName] = useState("");
  const [apartmentNumber, setApartmentNumber] = useState("");
  const [condominiumId, setCondominiumId] = useState("");

  useEffect(() => {
    if (!isLoginMode && condos.length === 0) {
      condominiumService.getAll().then(setCondos).catch(console.error);
    }
  }, [isLoginMode, condos.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      let result;
      if (isLoginMode) {
        result = await authService.login({ email, password });
      } else {
        if (!condominiumId) throw new Error("Por favor, selecione um condomínio");
        result = await authService.register({
          name,
          email,
          password,
          apartmentNumber,
          condominiumId,
        });
      }

      login(result.token, result.condominiumId, result.residentId, result.name);
    } catch (err: any) {
      setError(err.message || "Falha na autenticação. Verifique os dados.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card className="shadow-xl border-t-4 border-t-blue-600">
          <CardHeader className="bg-white rounded-t-xl text-center pb-2">
            <div className="mx-auto bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Building2 className="h-6 w-6 text-blue-700" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-800">Condomínio Digital</CardTitle>
            <CardDescription className="text-sm mt-2">
              {isLoginMode ? "Acesse sua conta para votar" : "Crie sua conta no seu condomínio"}
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-md border border-red-200 text-sm text-center">
                  {error}
                </div>
              )}

              {!isLoginMode && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">Seu Nome</Label>
                    <Input id="name" value={name} onChange={e => setName(e.target.value)} required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="condoId">Condomínio</Label>
                    <select 
                      id="condoId" 
                      value={condominiumId} 
                      onChange={e => setCondominiumId(e.target.value)}
                      required
                      className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="" disabled>Selecione seu condomínio...</option>
                      {condos.map(condo => (
                        <option key={condo.id} value={condo.id}>{condo.name} ({condo.address})</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="apt">Número do Apartamento / Bloco</Label>
                    <Input id="apt" value={apartmentNumber} onChange={e => setApartmentNumber(e.target.value)} required />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input 
                    id="password" 
                    type="password" 
                    className="pl-9"
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    required 
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isLoginMode ? "Entrar" : "Criar Conta"}
              </Button>
              <div className="text-center text-sm text-slate-500">
                {isLoginMode ? "Ainda não tem conta?" : "Já tem uma conta?"}{" "}
                <button 
                  type="button" 
                  onClick={() => {
                    setIsLoginMode(!isLoginMode);
                    setError("");
                  }} 
                  className="text-blue-600 hover:underline font-medium"
                >
                  {isLoginMode ? "Cadastre-se" : "Entre aqui"}
                </button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
