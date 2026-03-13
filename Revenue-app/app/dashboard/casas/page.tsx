"use client";

import { useAuth } from "@/lib/auth-context";
import { api, BettingHouse, AffiliateHouse } from "@/lib/api";
import useSWR from "swr";
import { Loader2, Copy, Check, ExternalLink } from "lucide-react";
import { useState } from "react";

interface UserWithHouses {
  houses?: AffiliateHouse[];
}

export default function CasasPage() {
  const { token, user } = useAuth();
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const { data: houses, isLoading } = useSWR<BettingHouse[]>(
    token ? "/api/houses" : null,
    (url: string): Promise<BettingHouse[]> => api(url, { token })
  );

  // Busca os links personalizados do usuario
  const { data: userDetails } = useSWR<UserWithHouses>(
    token && user?.id ? `/api/users/${user.id}` : null,
    (url: string): Promise<UserWithHouses> => api(url, { token })
  );

  const handleCopyLink = async (link: string, houseId: number) => {
    await navigator.clipboard.writeText(link);
    setCopiedId(houseId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const activeHouses = houses?.filter((h) => h.status === "active") || [];

  // Funcao para obter o link de divulgacao do usuario para uma casa
  const getUserLink = (houseId: number): string | null => {
    const userHouse = userDetails?.houses?.find((h) => h.house_id === houseId);
    return userHouse?.custom_link || null;
  };

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Casas</h1>
        <p className="text-sm text-muted-foreground">
          Links de divulgacao das casas de apostas
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeHouses.map((house) => {
            const userLink = getUserLink(house.id);
            
            return (
              <div
                key={house.id}
                className="bg-card border border-border rounded-xl p-4 lg:p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-base lg:text-lg font-bold text-foreground mb-4">{house.name}</h3>

                {userLink ? (
                  <div>
                    <p className="text-xs text-muted-foreground mb-2 uppercase font-semibold">
                      Link de Divulgacao
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={userLink}
                        readOnly
                        className="flex-1 min-w-0 px-3 py-2 text-sm rounded-lg border border-input bg-muted text-muted-foreground truncate"
                      />
                      <button
                        onClick={() => handleCopyLink(userLink, house.id)}
                        className="shrink-0 px-3 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors flex items-center gap-1"
                      >
                        {copiedId === house.id ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                      <a
                        href={userLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 px-3 py-2 rounded-lg border border-border text-muted-foreground hover:bg-muted transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    Link ainda nao disponivel
                  </p>
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
