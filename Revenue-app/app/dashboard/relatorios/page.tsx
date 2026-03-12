"use client";

import { useAuth } from "@/lib/auth-context";
import { api, CpaRecord } from "@/lib/api";
import useSWR from "swr";
import { Loader2, FileText, Calendar } from "lucide-react";

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
  });
}

export default function RelatoriosPage() {
  const { token, isAdmin } = useAuth();

  const { data: cpas, isLoading } = useSWR<CpaRecord[]>(
    token ? "/api/cpa" : null,
    (url: string) => api(url, { token })
  );

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

  // Calculate totals
  const totals = cpas?.reduce(
    (acc, cpa) => {
      acc.totalCpa += parseFloat(String(cpa.cpa_value));
      acc.totalDeposit += parseFloat(String(cpa.deposit_value));
      acc.count += 1;
      return acc;
    },
    { totalCpa: 0, totalDeposit: 0, count: 0 }
  ) || { totalCpa: 0, totalDeposit: 0, count: 0 };

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-end mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Relatórios</h1>
          <p className="text-muted-foreground">
            Histórico de CPAs registrados
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold">
                Total de CPAs
              </p>
              <p className="text-xl font-bold text-foreground">{totals.count}</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary/10">
              <Calendar className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold">
                Valor Total CPA
              </p>
              <p className="text-xl font-bold text-foreground">
                {formatCurrency(totals.totalCpa)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <Calendar className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold">
                Total Depósitos
              </p>
              <p className="text-xl font-bold text-foreground">
                {formatCurrency(totals.totalDeposit)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left min-w-[700px]">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b border-border">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Data
                </th>
                <th scope="col" className="px-6 py-3">
                  Casa
                </th>
                {isAdmin && (
                  <th scope="col" className="px-6 py-3">
                    Afiliado
                  </th>
                )}
                <th scope="col" className="px-6 py-3">
                  Jogador
                </th>
                <th scope="col" className="px-6 py-3">
                  Valor CPA
                </th>
                <th scope="col" className="px-6 py-3">
                  Depósito
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={isAdmin ? 7 : 6} className="px-6 py-8 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                  </td>
                </tr>
              ) : cpas?.length === 0 ? (
                <tr>
                  <td
                    colSpan={isAdmin ? 7 : 6}
                    className="px-6 py-8 text-center text-muted-foreground"
                  >
                    Nenhum CPA registrado ainda
                  </td>
                </tr>
              ) : (
                cpas?.map((cpa) => (
                  <tr
                    key={cpa.id}
                    className="bg-card border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-muted-foreground">
                      {formatDate(cpa.created_at)}
                    </td>
                    <td className="px-6 py-4 font-medium text-foreground">
                      {cpa.house_name}
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4">
                        <p className="text-foreground">{cpa.user_name || cpa.user_email}</p>
                      </td>
                    )}
                    <td className="px-6 py-4 text-muted-foreground">
                      {cpa.player_name || "-"}
                    </td>
                    <td className="px-6 py-4 font-semibold text-foreground">
                      {formatCurrency(parseFloat(String(cpa.cpa_value)))}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {formatCurrency(parseFloat(String(cpa.deposit_value)))}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                          cpa.status
                        )}`}
                      >
                        {getStatusLabel(cpa.status)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
