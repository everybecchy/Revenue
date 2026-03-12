"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { api, Withdrawal } from "@/lib/api";
import useSWR, { mutate } from "swr";
import {
  Loader2,
  Plus,
  Check,
  X,
  DollarSign,
} from "lucide-react";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function SaquesPage() {
  const { token, isAdmin } = useAuth();
  const [isNewOpen, setIsNewOpen] = useState(false);

  // Form states
  const [amount, setAmount] = useState("");
  const [pixKey, setPixKey] = useState("");
  const [pixType, setPixType] = useState<"cpf" | "cnpj" | "email" | "phone" | "random">("cpf");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { data: withdrawals, isLoading } = useSWR<Withdrawal[]>(
    token ? "/api/withdrawals" : null,
    (url: string): Promise<Withdrawal[]> => api(url, { token })
  );

  const handleNewWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await api("/api/withdrawals", {
        method: "POST",
        token,
        body: {
          amount: parseFloat(amount),
          pix_key: pixKey,
          pix_type: pixType,
        },
      });

      mutate("/api/withdrawals");
      setIsNewOpen(false);
      setAmount("");
      setPixKey("");
      setPixType("cpf");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao solicitar saque");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (withdrawalId: number, status: string) => {
    try {
      await api(`/api/withdrawals/${withdrawalId}/status`, {
        method: "PUT",
        token,
        body: { status },
      });
      mutate("/api/withdrawals");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro ao atualizar status");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-warning/10 text-warning";
      case "approved":
        return "bg-primary/10 text-primary";
      case "paid":
        return "bg-success/10 text-success";
      case "rejected":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendente";
      case "approved":
        return "Aprovado";
      case "paid":
        return "Pago";
      case "rejected":
        return "Rejeitado";
      default:
        return status;
    }
  };

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-end mb-6 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Saques</h1>
          <p className="text-sm text-muted-foreground">
            {isAdmin
              ? "Gerencie as solicitações de saque dos afiliados"
              : "Solicite e acompanhe seus saques"}
          </p>
        </div>
        {!isAdmin && (
          <button
            onClick={() => setIsNewOpen(true)}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary text-slate-800 font-medium py-2.5 px-4 rounded-lg hover:opacity-90 transition-opacity w-full sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            Solicitar Saque
          </button>
        )}
      </div>

      {/* Mobile Cards View */}
      <div className="block lg:hidden space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : withdrawals?.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-8 text-center text-muted-foreground">
            Nenhum saque encontrado
          </div>
        ) : (
          withdrawals?.map((withdrawal) => (
            <div
              key={withdrawal.id}
              className="bg-card border border-border rounded-xl p-4 space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold text-foreground">
                    {formatCurrency(parseFloat(String(withdrawal.amount)))}
                  </p>
                  <p className="text-xs text-muted-foreground">{formatDate(withdrawal.created_at)}</p>
                </div>
                <span
                  className={`shrink-0 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                    withdrawal.status
                  )}`}
                >
                  {getStatusLabel(withdrawal.status)}
                </span>
              </div>
              {isAdmin && (
                <p className="text-sm text-muted-foreground truncate">
                  {withdrawal.user_name || withdrawal.user_email}
                </p>
              )}
              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground uppercase">{withdrawal.pix_type}</p>
                <p className="text-sm text-foreground truncate">{withdrawal.pix_key}</p>
              </div>
              {isAdmin && withdrawal.status === "pending" && (
                <div className="flex items-center gap-2 pt-2 border-t border-border">
                  <button
                    onClick={() => handleUpdateStatus(withdrawal.id, "approved")}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-success/10 text-success transition-colors"
                  >
                    <Check className="h-4 w-4" />
                    <span className="text-sm">Aprovar</span>
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(withdrawal.id, "rejected")}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-destructive/10 text-destructive transition-colors"
                  >
                    <X className="h-4 w-4" />
                    <span className="text-sm">Rejeitar</span>
                  </button>
                </div>
              )}
              {isAdmin && withdrawal.status === "approved" && (
                <button
                  onClick={() => handleUpdateStatus(withdrawal.id, "paid")}
                  className="w-full py-2 rounded-lg bg-success/10 text-success text-sm font-medium hover:bg-success/20 transition-colors"
                >
                  Marcar como Pago
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block bg-card border border-border rounded-xl shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left min-w-[600px]">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b border-border">
              <tr>
                {isAdmin && (
                  <th scope="col" className="px-6 py-3">
                    Afiliado
                  </th>
                )}
                <th scope="col" className="px-6 py-3">
                  Valor
                </th>
                <th scope="col" className="px-6 py-3">
                  Chave PIX
                </th>
                <th scope="col" className="px-6 py-3">
                  Data
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                {isAdmin && (
                  <th scope="col" className="px-6 py-3 text-right">
                    Ações
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={isAdmin ? 6 : 4} className="px-6 py-8 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                  </td>
                </tr>
              ) : withdrawals?.length === 0 ? (
                <tr>
                  <td
                    colSpan={isAdmin ? 6 : 4}
                    className="px-6 py-8 text-center text-muted-foreground"
                  >
                    Nenhum saque encontrado
                  </td>
                </tr>
              ) : (
                withdrawals?.map((withdrawal) => (
                  <tr
                    key={withdrawal.id}
                    className="bg-card border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    {isAdmin && (
                      <td className="px-6 py-4">
                        <p className="font-medium text-foreground">
                          {withdrawal.user_name || withdrawal.user_email}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {withdrawal.user_email}
                        </p>
                      </td>
                    )}
                    <td className="px-6 py-4 font-semibold text-foreground">
                      {formatCurrency(parseFloat(String(withdrawal.amount)))}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-foreground">{withdrawal.pix_key}</p>
                      <p className="text-xs text-muted-foreground uppercase">
                        {withdrawal.pix_type}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {formatDate(withdrawal.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                          withdrawal.status
                        )}`}
                      >
                        {getStatusLabel(withdrawal.status)}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 text-right">
                        {withdrawal.status === "pending" && (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() =>
                                handleUpdateStatus(withdrawal.id, "approved")
                              }
                              className="p-2 rounded-lg hover:bg-success/10 text-success transition-colors"
                              title="Aprovar"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() =>
                                handleUpdateStatus(withdrawal.id, "rejected")
                              }
                              className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                              title="Rejeitar"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                        {withdrawal.status === "approved" && (
                          <button
                            onClick={() =>
                              handleUpdateStatus(withdrawal.id, "paid")
                            }
                            className="px-3 py-1.5 rounded-lg bg-success/10 text-success text-xs font-medium hover:bg-success/20 transition-colors"
                          >
                            Marcar como Pago
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Withdrawal Modal */}
      {isNewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-foreground/50"
            onClick={() => setIsNewOpen(false)}
          />
          <div className="relative w-full max-w-md bg-card rounded-2xl shadow-xl animate-fadeIn">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">
                Solicitar Saque
              </h2>
              <button
                onClick={() => setIsNewOpen(false)}
                className="p-2 rounded-lg hover:bg-muted text-muted-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleNewWithdrawal} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Valor do Saque (R$) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="0,00"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Tipo de Chave PIX *
                </label>
                <select
                  value={pixType}
                  onChange={(e) => setPixType(e.target.value as typeof pixType)}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="cpf">CPF</option>
                  <option value="cnpj">CNPJ</option>
                  <option value="email">E-mail</option>
                  <option value="phone">Telefone</option>
                  <option value="random">Chave Aleatória</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Chave PIX *
                </label>
                <input
                  type="text"
                  value={pixKey}
                  onChange={(e) => setPixKey(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Digite sua chave PIX"
                  required
                />
              </div>

              {error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-lg p-3 text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewOpen(false)}
                  className="flex-1 px-4 py-3 rounded-lg border border-border text-foreground hover:bg-muted transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-slate-800 font-medium hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Solicitar Saque"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
