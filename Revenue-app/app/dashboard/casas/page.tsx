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

  const { data: houses } = useSWR<BettingHouse[]>(
    token ? "/api/houses" : null,
    (url: string): Promise<BettingHouse[]> => api(url, { token })
  );

  // Busca os links personalizados do usuario
  const { data: userDetails, isLoading } = useSWR<UserWithHouses>(
    token && user?.id ? `/api/users/${user.id}` : null,
    (url: string): Promise<UserWithHouses> => api(url, { token })
  );

  const handleCopyLink = async (link: string, houseId: number) => {
    await navigator.clipboard.writeText(link);
    setCopiedId(houseId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtra apenas as casas que estao habilitadas para o usuario e tem link cadastrado
  const userActiveHouses = userDetails?.houses?.filter(
    (h) => h.is_active && h.custom_link
  ) || [];

  // Busca os dados completos da casa pelo house_id
  const getHouseName = (houseId: number): string => {
    const house = houses?.find((h) => h.id === houseId);
    return house?.name || "Casa";
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
          {userActiveHouses.map((userHouse) => (
            <div
              key={userHouse.house_id}
              className="bg-card border border-border rounded-xl p-4 lg:p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-base lg:text-lg font-bold text-foreground mb-4">
                {userHouse.house_name || getHouseName(userHouse.house_id)}
              </h3>

              <div>
                <p className="text-xs text-muted-foreground mb-2 uppercase font-semibold">
                  Link de Divulgacao
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={userHouse.custom_link || ""}
                    readOnly
                    className="flex-1 min-w-0 px-3 py-2 text-sm rounded-lg border border-input bg-muted text-muted-foreground truncate"
                  />
                  <button
                    onClick={() => handleCopyLink(userHouse.custom_link!, userHouse.house_id)}
                    className="shrink-0 px-3 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors flex items-center gap-1"
                  >
                    {copiedId === userHouse.house_id ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                  <a
                    href={userHouse.custom_link!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 px-3 py-2 rounded-lg border border-border text-muted-foreground hover:bg-muted transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}

          {userActiveHouses.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              Nenhuma casa de apostas disponivel para voce ainda
            </div>
          )}
        </div>
      )}
    </div>
  );
}
