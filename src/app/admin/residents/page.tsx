"use client";

import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/components/providers/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { useEffect, useState } from "react";
import { adminService } from "@/lib/api/admin.service";
import { AdminResidentResponse, UpdateResidentRequest } from "@/types";
import { Users, UserX, UserCheck, Edit2, Search, AlertTriangle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ResidentsPage() {
  const { role, condominiumId } = useAuth();
  const [residents, setResidents] = useState<AdminResidentResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Edit Modal State
  const [editingResident, setEditingResident] = useState<AdminResidentResponse | null>(null);
  const [editForm, setEditForm] = useState<UpdateResidentRequest>({ name: "", apartmentNumber: "" });
  const [isSaving, setIsSaving] = useState(false);

  // Ban Modal State
  const [banningResident, setBanningResident] = useState<AdminResidentResponse | null>(null);
  const [isBanning, setIsBanning] = useState(false);

  useEffect(() => {
    if (condominiumId && role === "Admin") {
      loadResidents();
    }
  }, [condominiumId, role]);

  const loadResidents = async () => {
    setIsLoading(true);
    try {
      if (condominiumId) {
        const data = await adminService.getResidents(condominiumId);
        setResidents(data);
      }
    } catch (error) {
      console.error("Failed to load residents:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (resident: AdminResidentResponse) => {
    setEditingResident(resident);
    setEditForm({ name: resident.name, apartmentNumber: resident.apartmentNumber });
  };

  const handleSaveEdit = async () => {
    if (!editingResident || !condominiumId) return;
    
    if (!confirm(`Deseja salvar as alterações para ${editingResident.name}?`)) {
      return;
    }

    setIsSaving(true);
    try {
      await adminService.updateResident(condominiumId, editingResident.id, editForm);
      setResidents(residents.map(r => r.id === editingResident.id ? { ...r, ...editForm } : r));
      setEditingResident(null);
    } catch (error) {
      console.error("Failed to update resident:", error);
      alert("Erro ao atualizar morador.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleBanToggle = async (resident: AdminResidentResponse) => {
    if (!condominiumId) return;
    setIsBanning(true);
    try {
      if (resident.isBanned) {
        await adminService.unbanResident(condominiumId, resident.id);
        setResidents(residents.map(r => r.id === resident.id ? { ...r, isBanned: false } : r));
      } else {
        await adminService.banResident(condominiumId, resident.id);
        setResidents(residents.map(r => r.id === resident.id ? { ...r, isBanned: true } : r));
      }
      setBanningResident(null);
    } catch (error) {
      console.error("Failed to toggle ban status:", error);
      alert("Erro ao alterar status do morador.");
    } finally {
      setIsBanning(false);
    }
  };

  const filteredResidents = residents.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.apartmentNumber.includes(searchTerm)
  );

  if (role !== "Admin") {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
          <h2 className="text-2xl font-bold text-slate-900">Acesso Negado</h2>
          <p className="text-slate-500">Você não tem permissão para acessar esta página.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Gerenciar Moradores</h2>
          <p className="text-slate-500 mt-1">Visualize e gerencie todos os moradores do condomínio.</p>
        </div>

        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <CardHeader className="bg-white border-b border-slate-100 flex flex-row items-center justify-between space-y-0 py-4">
            <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Lista de Moradores
            </CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Pesquisar..." 
                className="pl-9 bg-slate-50 border-slate-200 text-sm h-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : filteredResidents.length === 0 ? (
              <div className="text-center py-20 text-slate-500">
                {searchTerm ? "Nenhum morador encontrado para esta pesquisa." : "Nenhum morador cadastrado."}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-3">Nome</th>
                      <th className="px-6 py-3">Email</th>
                      <th className="px-6 py-3">Unidade</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredResidents.map((resident) => (
                      <tr key={resident.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-900">{resident.name}</td>
                        <td className="px-6 py-4 text-slate-600">{resident.email}</td>
                        <td className="px-6 py-4 text-slate-600">{resident.apartmentNumber}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                            resident.isBanned 
                              ? "bg-red-50 text-red-700 border border-red-100" 
                              : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          }`}>
                            {resident.isBanned ? "Banido" : "Ativo"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => handleEdit(resident)}
                              title="Editar morador"
                            >
                              <Edit2 className="h-4 w-4 text-slate-500" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className={`h-8 w-8 p-0 ${resident.isBanned ? "text-emerald-600" : "text-red-500"}`}
                              onClick={() => setBanningResident(resident)}
                              title={resident.isBanned ? "Desbanir morador" : "Banir morador"}
                            >
                              {resident.isBanned ? <UserCheck className="h-4 w-4" /> : <UserX className="h-4 w-4" />}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingResident && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setEditingResident(null)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden"
            >
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Editar Morador</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input 
                      id="name" 
                      value={editForm.name} 
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit">Unidade / Apartamento</Label>
                    <Input 
                      id="unit" 
                      value={editForm.apartmentNumber} 
                      onChange={(e) => setEditForm({...editForm, apartmentNumber: e.target.value})}
                    />
                  </div>
                </div>
                <div className="mt-8 flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setEditingResident(null)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveEdit} disabled={isSaving}>
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Salvar Alterações
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Ban/Unban Confirmation Modal */}
      <AnimatePresence>
        {banningResident && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setBanningResident(null)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden"
            >
              <div className="p-6 text-center">
                <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                  banningResident.isBanned ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"
                }`}>
                  {banningResident.isBanned ? <UserCheck className="h-6 w-6" /> : <UserX className="h-6 w-6" />}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {banningResident.isBanned ? "Desbanir Morador?" : "Banir Morador?"}
                </h3>
                <p className="text-slate-500 mb-6">
                  {banningResident.isBanned 
                    ? `Tem certeza que deseja remover o banimento de ${banningResident.name}?` 
                    : `Tem certeza que deseja banir ${banningResident.name}? Ele perderá o acesso ao sistema.`}
                </p>
                <div className="flex justify-center gap-3">
                  <Button variant="outline" onClick={() => setBanningResident(null)}>
                    Cancelar
                  </Button>
                  <Button 
                    variant={banningResident.isBanned ? "default" : "destructive"} 
                    onClick={() => handleBanToggle(banningResident)}
                    disabled={isBanning}
                  >
                    {isBanning ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Confirmar
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </MainLayout>
  );
}
