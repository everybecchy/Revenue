"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { api, User, BettingHouse, AffiliateHouse } from "@/lib/api";
import useSWR, { mutate } from "swr";

interface EditAffiliateModalProps {
  user: User;
  onClose: () => void;
}

interface UserWithHouses extends User {
  houses?: AffiliateHouse[];
}

export default function EditAffiliateModal({
  user,
  onClose,
}: EditAffiliateModalProps) {
  const { token } = useAuth();

  // Metrics
  const [registros, setRegistros] = useState(String(user.registros || 0));
  const [ftd, setFtd] = useState(String(user.ftd || 0));
  const [qftd, setQftd] = useState(String(user.qftd || 0));
  const [depositos, setDepositos] = useState(String(user.depositos || 0));
  const [rev, setRev] = useState(String(user.rev || 0));
  const [cpa, setCpa] = useState(String(user.cpa || 0));

  // Houses
  const [houseSettings, setHouseSettings] = useState<
    Record<number, { isActive: boolean; cpaAgreement: string; customLink: string }>
  >({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Fetch houses
  const { data: houses } = useSWR<BettingHouse[]>(
    token ? "/api/houses" : null,
    (url: string) => api(url, { token })
  );

  // Fetch user details with houses
  const { data: userDetails } = useSWR<UserWithHouses>(
    token && user.id ? `/api/users/${user.id}` : null,
    (url: string) => api(url, { token })
  );

  // Initialize house settings when data loads
  useEffect(() => {
    if (houses && userDetails?.houses) {
      const settings: Record<
        number,
        { isActive: boolean; cpaAgreement: string; customLink: string }
      > = {};

      houses.forEach((house) => {
        const userHouse = userDetails.houses?.find((h) => h.house_id === house.id);
        settings[house.id] = {
          isActive: userHouse?.is_active || false,
          cpaAgreement: String(userHouse?.cpa_agreement || 0),
          customLink: userHouse?.custom_link || "",
        };
      });

      setHouseSettings(settings);
    }
  }, [houses, userDetails]);

  const handleHouseToggle = (houseId: number) => {
    setHouseSettings((prev) => ({
      ...prev,
      [houseId]: {
        ...prev[houseId],
        isActive: !prev[houseId]?.isActive,
      },
    }));
  };

  const handleHouseChange = (
    houseId: number,
    field: "cpaAgreement" | "customLink",
    value: string
  ) => {
    setHouseSettings((prev) => ({
      ...prev,
      [houseId]: {
        ...prev[houseId],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // Update metrics
      await api(`/api/users/${user.id}/metrics`, {
        method: "PUT",
        token,
        body: {
          registros: parseInt(registros) || 0,
          ftd: parseInt(ftd) || 0,
          qftd: parseInt(qftd) || 0,
          depositos: parseFloat(depositos) || 0,
          rev: parseFloat(rev) || 0,
          cpa: parseFloat(cpa) || 0,
        },
      });

      // Update houses
      const housesData = Object.entries(houseSettings).map(([houseId, settings]) => ({
        house_id: parseInt(houseId),
        cpa_agreement: parseFloat(settings.cpaAgreement) || 0,
        custom_link: settings.customLink || null,
        is_active: settings.isActive,
      }));

      await api(`/api/users/${user.id}/houses`, {
        method: "PUT",
        token,
        body: { houses: housesData },
      });

      mutate("/api/users");
      mutate(`/api/users/${user.id}`);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar alterações");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-foreground/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card rounded-2xl shadow-xl animate-fadeIn">
        <div className="sticky top-0 bg-card flex items-center justify-between p-4 border-b border-border z-10">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Editando Afiliado</h2>
            <p className="text-sm text-primary">{user.email}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted text-muted-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          {/* Section 1: Metrics */}
          <div>
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide mb-4">
              1. Forçar Métricas (Overview)
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Registros (Qtd)
                </label>
                <input
                  type="number"
                  min="0"
                  value={registros}
                  onChange={(e) => setRegistros(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  FTD (Qtd)
                </label>
                <input
                  type="number"
                  min="0"
                  value={ftd}
                  onChange={(e) => setFtd(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  QFTD (Qtd)
                </label>
                <input
                  type="number"
                  min="0"
                  value={qftd}
                  onChange={(e) => setQftd(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Depósitos (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={depositos}
                  onChange={(e) => setDepositos(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  REV (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={rev}
                  onChange={(e) => setRev(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  CPA (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={cpa}
                  onChange={(e) => setCpa(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Houses */}
          <div>
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide mb-4">
              2. Casas, Comissões e Links
            </h3>
            <div className="space-y-4">
              {houses?.map((house) => (
                <div
                  key={house.id}
                  className="border border-border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id={`house-${house.id}`}
                      checked={houseSettings[house.id]?.isActive || false}
                      onChange={() => handleHouseToggle(house.id)}
                      className="w-5 h-5 rounded border-input text-primary focus:ring-primary accent-primary"
                    />
                    <label
                      htmlFor={`house-${house.id}`}
                      className="font-medium text-foreground cursor-pointer"
                    >
                      {house.name}
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-8">
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1 uppercase">
                        Acordo CPA (R$)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={houseSettings[house.id]?.cpaAgreement || "0"}
                        onChange={(e) =>
                          handleHouseChange(house.id, "cpaAgreement", e.target.value)
                        }
                        disabled={!houseSettings[house.id]?.isActive}
                        className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:bg-muted"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1 uppercase">
                        Link Personalizado do Afiliado
                      </label>
                      <input
                        type="url"
                        value={houseSettings[house.id]?.customLink || ""}
                        onChange={(e) =>
                          handleHouseChange(house.id, "customLink", e.target.value)
                        }
                        disabled={!houseSettings[house.id]?.isActive}
                        placeholder="Cole o link de trackeamento aqui..."
                        className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:bg-muted placeholder:text-muted-foreground"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-lg p-3 text-sm">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg border border-border text-foreground hover:bg-muted transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-medium hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar Alterações"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
