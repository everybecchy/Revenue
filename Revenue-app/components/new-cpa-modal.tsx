"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { api, BettingHouse } from "@/lib/api";
import useSWR, { mutate } from "swr";

interface NewCpaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewCpaModal({ isOpen, onClose }: NewCpaModalProps) {
  const { token } = useAuth();
  const [houseId, setHouseId] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [cpaValue, setCpaValue] = useState("");
  const [depositValue, setDepositValue] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { data: houses } = useSWR<BettingHouse[]>(
    token ? "/api/houses" : null,
    (url: string): Promise<BettingHouse[]> => api(url, { token })
  );

  useEffect(() => {
    if (!isOpen) {
      setHouseId("");
      setPlayerName("");
      setCpaValue("");
      setDepositValue("");
      setNotes("");
      setError("");
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await api("/api/cpa", {
        method: "POST",
        token,
        body: {
          house_id: parseInt(houseId),
          player_name: playerName || null,
          cpa_value: parseFloat(cpaValue),
          deposit_value: depositValue ? parseFloat(depositValue) : 0,
          notes: notes || null,
        },
      });

      mutate("/api/cpa");
      mutate("/api/dashboard");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao registrar CPA");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-foreground/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-card rounded-2xl shadow-xl animate-fadeIn">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Novo CPA Obtido</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted text-muted-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Casa de Apostas *
            </label>
            <select
              value={houseId}
              onChange={(e) => setHouseId(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value="">Selecione uma casa</option>
              {houses?.map((house) => (
                <option key={house.id} value={house.id}>
                  {house.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Nome do Jogador
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Nome ou ID do jogador"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Valor do CPA (R$) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={cpaValue}
                onChange={(e) => setCpaValue(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="0,00"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Depósito (R$)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={depositValue}
                onChange={(e) => setDepositValue(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="0,00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Observações
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              rows={3}
              placeholder="Anotações opcionais..."
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
              onClick={onClose}
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
                  Salvando...
                </>
              ) : (
                "Registrar CPA"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
