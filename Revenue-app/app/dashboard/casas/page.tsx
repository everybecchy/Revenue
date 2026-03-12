"use client";

import { useAuth } from "@/lib/auth-context";
import { api, BettingHouse } from "@/lib/api";
import useSWR from "swr";
import { Loader2, Copy, Check, ExternalLink } from "lucide-react";
import { useState } from "react";

interface HouseByReport {
  id: number;
  name: string;
  cpa_percentage: number;
  total_cpas: number;
  total_cpa_value: number;
  total_deposits: number;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export default function CasasPage() {
  const { token } = useAuth();
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const { data: houses, isLoading } = useSWR<BettingHouse[]>(
    token ? "/api/houses" : null,
    (url: string) => api(url, { token })
  );

  const { data: houseReports } = useSWR<HouseByReport[]>(
    token ? "/api/dashboard/by-house" : null,
    (url: string) => api(url, { token })
  );

  const handleCopyLink = async (house: BettingHouse) => {
    if (house.affiliate_link) {
      await navigator.clipboard.writeText(house.affiliate_link);
      setCopiedId(house.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const activeHouses = houses?.filter((h) => h.status === "active") || [];

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Detalhados por Casa</h1>
        <p className="text-muted-foreground">
          Métricas e links de afiliado por casa de apostas
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeHouses.map((house) => {
            const report = houseReports?.find((r) => r.id === house.id);
            
            return (
              <div
                key={house.id}
                className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-foreground">{house.name}</h3>
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                    {house.cpa_percentage}% CPA
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total de CPAs</span>
                    <span className="font-medium text-foreground">
                      {report?.total_cpas || 0}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Valor CPA</span>
                    <span className="font-medium text-foreground">
                      {formatCurrency(parseFloat(String(report?.total_cpa_value || 0)))}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Depósitos</span>
                    <span className="font-medium text-foreground">
                      {formatCurrency(parseFloat(String(report?.total_deposits || 0)))}
                    </span>
                  </div>
                </div>

                {house.affiliate_link && (
                  <div className="pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-2 uppercase font-semibold">
                      Link de Divulgação
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={house.affiliate_link}
                        readOnly
                        className="flex-1 px-3 py-2 text-sm rounded-lg border border-input bg-muted text-muted-foreground truncate"
                      />
                      <button
                        onClick={() => handleCopyLink(house)}
                        className="px-3 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors flex items-center gap-1"
                      >
                        {copiedId === house.id ? (
                          <>
                            <Check className="h-4 w-4" />
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" />
                          </>
                        )}
                      </button>
                      <a
                        href={house.affiliate_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 rounded-lg border border-border text-muted-foreground hover:bg-muted transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {activeHouses.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              Nenhuma casa de apostas ativa
            </div>
          )}
        </div>
      )}
    </div>
  );
}
