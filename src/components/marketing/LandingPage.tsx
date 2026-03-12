"use client";

import React from "react";
import { motion } from "framer-motion";
import { Building2, CheckCircle2, Shield, Users, ArrowRight, Star, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-1.5 rounded-lg shadow-lg shadow-blue-200">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
                Unanimato
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
              <a href="#features" className="hover:text-blue-600 transition-colors">Funcionalidades</a>
              <a href="#about" className="hover:text-blue-600 transition-colors">Sobre</a>
              <Link href="/setup">
                <Button variant="ghost" className="text-slate-600">Entrar</Button>
              </Link>
              <Link href="/setup">
                <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200">Começar Agora</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-3xl opacity-60 animate-pulse" />
          <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-indigo-50 rounded-full blur-3xl opacity-60" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-6 border border-blue-100"
          >
            <Star className="h-3 w-3 fill-blue-500" />
            <span>A Evolução da Gestão Condominial</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-[1.1]"
          >
            Decisões Coletivas, <br />
            <span className="text-blue-600">Simples e Transparentes.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 mb-10 leading-relaxed"
          >
            A Unanimato moderniza o voto em condomínios. Uma plataforma intuitiva, segura e ágil para transformar a convivência e a administração.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/setup">
              <Button size="lg" className="h-14 px-8 text-lg bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-200 group">
                Explorar Agora
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-slate-200 text-slate-700 hover:bg-slate-50">
              Ver Demonstração
            </Button>
          </motion.div>

          {/* Abstract Interface Preview */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="mt-16 md:mt-24 relative max-w-5xl mx-auto"
          >
             <div className="absolute inset-0 bg-blue-600/5 blur-3xl -z-10 rounded-full scale-90" />
             <div className="bg-slate-900 rounded-2xl p-4 md:p-8 shadow-2xl border border-slate-800 backdrop-blur-sm overflow-hidden min-h-[300px] flex items-center justify-center">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                   {/* Card 1: Votation */}
                   <motion.div 
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                      className="bg-white/10 rounded-2xl border border-white/10 backdrop-blur-md p-5 flex flex-col gap-4"
                   >
                      <div className="flex justify-between items-start">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                          <CheckCircle2 className="h-5 w-5 text-blue-400" />
                        </div>
                        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider bg-blue-400/10 px-2 py-0.5 rounded">Ativo</span>
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm mb-1">Reforma da Fachada</p>
                        <p className="text-slate-400 text-xs text-left">85% de participação alcançada</p>
                      </div>
                      <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: "85%" }}
                          transition={{ duration: 1.5, delay: 1 }}
                          className="bg-blue-500 h-full" 
                        />
                      </div>
                   </motion.div>

                   {/* Card 2: Notifications */}
                   <motion.div 
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 5, repeat: Infinity, delay: 0.5, ease: "easeInOut" }}
                      className="bg-white/10 rounded-2xl border border-white/10 backdrop-blur-md p-5 flex flex-col gap-4"
                   >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                          <Users className="h-4 w-4 text-emerald-400" />
                        </div>
                        <div className="text-left">
                          <p className="text-white text-xs font-medium">Reunião de Condôminos</p>
                          <p className="text-slate-500 text-[10px]">Hoje, às 19:30</p>
                        </div>
                      </div>
                      <div className="h-px bg-white/5 w-full" />
                      <div className="flex items-center gap-3 opacity-50">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <Shield className="h-4 w-4 text-blue-400" />
                        </div>
                        <div className="text-left">
                          <p className="text-white text-xs font-medium">Manutenção Elevadores</p>
                          <p className="text-slate-500 text-[10px]">Concluído</p>
                        </div>
                      </div>
                   </motion.div>

                   {/* Card 3: Analytics */}
                   <motion.div 
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 5, repeat: Infinity, delay: 1, ease: "easeInOut" }}
                      className="bg-white/10 rounded-2xl border border-white/10 backdrop-blur-md p-5 flex flex-col gap-4"
                   >
                      <div className="flex justify-between items-center">
                        <p className="text-white text-xs font-semibold tracking-wide">Engajamento Mensal</p>
                        <ArrowUpRight className="h-4 w-4 text-emerald-400" />
                      </div>
                      <div className="flex items-end gap-1.5 h-16 mt-2">
                        {[40, 70, 45, 90, 65, 80].map((h, i) => (
                          <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: `${h}%` }}
                            transition={{ duration: 1, delay: 1.5 + (i * 0.1) }}
                            className="flex-1 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-sm"
                          />
                        ))}
                      </div>
                      <p className="text-emerald-400 text-[10px] font-bold">+12.5% em relação ao mês anterior</p>
                   </motion.div>
                </div>
             </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-semibold text-blue-600 tracking-wider uppercase mb-3">Eficiência</h2>
            <p className="text-3xl md:text-4xl font-bold text-slate-900">Tudo que seu condomínio precisa</p>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              { icon: CheckCircle2, title: "Votação Digital", desc: "Realize assembleias e votações de qualquer lugar, com total validade." },
              { icon: Shield, title: "Segurança Total", desc: "Dados criptografados e processos auditáveis para total transparência." },
              { icon: Users, title: "Gestão de Moradores", desc: "Controle centralizado de acesso e comunicação direta com todos." },
              { icon: Building2, title: "Dashboard", desc: "Métricas claras sobre a saúde e participação do seu condomínio." }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                variants={fadeInUp}
                className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 overflow-hidden">
        <div className="max-w-5xl mx-auto relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-blue-600 rounded-3xl p-12 md:p-20 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-900/20 rounded-full -ml-32 -mb-32 blur-3xl" />
            
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 relative z-10">Pronto para elevar o nível do seu condomínio?</h2>
            <p className="text-blue-100 text-lg mb-10 max-w-xl mx-auto relative z-10">Junte-se a centenas de condomínios que já utilizam a Unanimato para simplificar o cotidiano.</p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <Link href="/setup">
                <Button size="lg" className="h-14 px-10 text-lg bg-white text-blue-600 hover:bg-blue-50">
                  Criar Conta Grátis
                </Button>
              </Link>
              <Button size="lg" variant="ghost" className="h-14 px-8 text-lg text-white hover:bg-white/10">
                Falar com consultor
                <ArrowUpRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold text-slate-900 uppercase tracking-tight">Unanimato</span>
            </div>
            <p className="text-slate-500 text-sm">© 2026 Unanimato Tecnologias. Todos os direitos reservados.</p>
            <div className="flex gap-6 text-sm text-slate-600 font-medium">
              <a href="#" className="hover:text-blue-600 transition-colors">Privacidade</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Termos</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Contato</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
