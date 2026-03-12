"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { api, BettingHouse } from "@/lib/api";
import useSWR, { mutate } from "swr";
import { Search, Plus, Edit, Trash2, Loader2, Check } from "lucide-react";

export default function AdminCasasPage() {
  const { token, isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingHouse, setEditingHouse] = useState<BettingHouse | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [cpaPercentage, setCpaPercentage] = useState("");
  const [affiliateLink, setAffiliateLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { data: houses, isLoading } = useSWR<BettingHouse[]>(
    token && isAdmin ? "/api/houses" : null,
    (url: string): Promise<BettingHouse[]> => api(url, { token })
  );

  const filteredHouses = houses?.filter((house) =>
    house.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setName("");
    setCpaPercentage("");
    setAffiliateLink("");
    setEditingHouse(null);
    setError("");
  };

  const handleEdit = (house: BettingHouse) => {
    setEditingHouse(house);
    setName(house.name);
    setCpaPercentage(String(house.cpa_percentage || ""));
    setAffiliateLink(house.affiliate_link || "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (editingHouse) {
        // Update
        await api(`/api/houses/${editingHouse.id}`, {
          method: "PUT",
          token,
          body: {
            name,
            cpa_percentage: parseFloat(cpaPercentage) || 0,
            affiliate_link: affiliateLink || null,
          },
        });
      } else {
        // Create
        await api("/api/houses", {
          method: "POST",
          token,
          body: {
            name,
            cpa_percentage: parseFloat(cpaPercentage) || 0,
            affiliate_link: affiliateLink || null,
          },
        });
      }

      mutate("/api/houses");
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar casa");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (houseId: number) => {
    if (!confirm("Tem certeza que deseja excluir esta casa?")) return;

    try {
      await api(`/api/houses/${houseId}`, {
        method: "DELETE",
        token,
      });
      mutate("/api/houses");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao excluir casa");
    }
  };

  const handleToggleStatus = async (house: BettingHouse) => {
    try {
      await api(`/api/houses/${house.id}`, {
        method: "PUT",
        token,
        body: {
          status: house.status === "active" ? "inactive" : "active",
        },
      });
      mutate("/api/houses");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao alterar status");
    }
  };

  if (!isAdmin) {
    return (
      <div className="p-4 lg:p-8">
        <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-lg p-4">
          Acesso negado. Somente administradores podem acessar esta página.
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-end mb-6 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            Gerenciar Casas de Apostas
          </h1>
          <p className="text-sm text-muted-foreground">
            Cadastre e gerencie as casas de apostas parceiras
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Form */}
        <div className="bg-card border border-border rounded-xl p-4 lg:p-5 shadow-sm lg:col-span-1 h-fit order-2 lg:order-1">
          <h3 className="text-base lg:text-lg font-bold text-foreground mb-4 border-b border-border pb-2">
            {editingHouse ? "Editar Casa" : "Nova Casa"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-3 lg:space-y-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Nome da Casa *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: BetMGM"
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                % CPA Padrão
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={cpaPercentage}
                  onChange={(e) => setCpaPercentage(e.target.value)}
                  placeholder="0"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <span className="absolute right-3 top-2.5 text-muted-foreground">
                  %
                </span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Link de Afiliado Base
              </label>
              <input
                type="url"
                value={affiliateLink}
                onChange={(e) => setAffiliateLink(e.target.value)}
                placeholder="https://casa.com/ref/"
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-lg p-3 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-2">
              {editingHouse && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-border text-foreground hover:bg-muted transition-colors"
                >
                  Cancelar
                </button>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-primary to-secondary text-slate-800 font-medium py-2.5 px-4 rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : editingHouse ? (
                  <>
                    <Check className="h-4 w-4" />
                    Salvar
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Cadastrar Casa
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Table / Cards */}
        <div className="bg-card border border-border rounded-xl shadow-sm lg:col-span-2 flex flex-col order-1 lg:order-2">
          <div className="p-4 lg:p-6 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center bg-muted/50 gap-3 rounded-t-xl">
            <h3 className="text-base lg:text-lg font-bold text-foreground">
              Casas Cadastradas
            </h3>
            <div className="relative w-full sm:w-auto">
              <input
                type="text"
                placeholder="Buscar casa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 rounded-lg border border-input bg-background pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Search className="absolute left-3 top-2.5 text-muted-foreground h-4 w-4" />
            </div>
          </div>

          {/* Mobile Cards View */}
          <div className="block lg:hidden p-4 space-y-3">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : filteredHouses?.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">
                Nenhuma casa encontrada
              </p>
            ) : (
              filteredHouses?.map((house) => (
                <div
                  key={house.id}
                  className="bg-muted/50 rounded-xl p-4 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground">
                        {house.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {house.cpa_percentage}% CPA
                      </p>
                    </div>
                    <button
                      onClick={() => handleToggleStatus(house)}
                      className={`shrink-0 ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                        house.status === "active"
                          ? "bg-success/10 text-success hover:bg-success/20"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {house.status === "active" ? "Ativa" : "Inativa"}
                    </button>
                  </div>
                  {house.affiliate_link && (
                    <p className="text-xs text-muted-foreground truncate">
                      {house.affiliate_link}
                    </p>
                  )}
                  <div className="flex items-center gap-2 pt-2 border-t border-border">
                    <button
                      onClick={() => handleEdit(house)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-primary/10 text-primary transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                      <span className="text-sm">Editar</span>
                    </button>
                    <button
                      onClick={() => handleDelete(house.id)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-destructive/10 text-destructive transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="text-sm">Excluir</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-sm text-left min-w-[500px]">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b border-border">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Casa
                  </th>
                  <th scope="col" className="px-6 py-3">
                    % CPA
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                    </td>
                  </tr>
                ) : filteredHouses?.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-8 text-center text-muted-foreground"
                    >
                      Nenhuma casa encontrada
                    </td>
                  </tr>
                ) : (
                  filteredHouses?.map((house) => (
                    <tr
                      key={house.id}
                      className="bg-card border-b border-border hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-foreground">
                          {house.name}
                        </p>
                        {house.affiliate_link && (
                          <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {house.affiliate_link}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-foreground">
                        {house.cpa_percentage}%
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleStatus(house)}
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                            house.status === "active"
                              ? "bg-success/10 text-success hover:bg-success/20"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          }`}
                        >
                          {house.status === "active" ? "Ativa" : "Inativa"}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(house)}
                            className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(house.id)}
                            className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
