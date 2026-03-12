"use client";

import { useAuth } from "@/lib/auth-context";
import { api, DashboardMetrics } from "@/lib/api";
import useSWR from "swr";
import {
  Users,
  CreditCard,
  DollarSign,
  TrendingUp,
  Building2,
  Receipt,
  Coins,
} from "lucide-react";
import Image from "next/image";

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  iconColor?: string;
}

function MetricCard({
  icon,
  label,
  value,
  iconColor = "text-[var(--color-primary)]",
}: MetricCardProps) {
  return (
    <div className="bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] p-4 sm:p-5 flex items-center gap-3 sm:gap-4 shadow-sm hover:shadow-md transition-shadow">
      <div className={`${iconColor} text-2xl sm:text-3xl shrink-0`}>{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] sm:text-xs text-[var(--color-muted-foreground)] font-semibold uppercase tracking-wide truncate">
          {label}
        </p>
        <p className="text-lg sm:text-2xl font-bold text-[var(--color-foreground)] truncate">{value}</p>
      </div>
    </div>
  );
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export default function DashboardPage() {
  const { token, user } = useAuth();

  const { data: metrics, isLoading } = useSWR<DashboardMetrics>(
    token ? "/api/dashboard" : null,
    (url: string): Promise<DashboardMetrics> => api(url, { token })
  );

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <header className="flex items-center justify-between mb-6 lg:mb-8">
        <div className="lg:hidden">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo%20refinado%20BravoPanel%20Mar%2012%202026-ECztNMkP4MRp9EWbVxs4Fgwj4TJJTt.png"
            alt="Revenue"
            width={160}
            height={50}
            className="h-12 w-auto"
            priority
          />
        </div>
        <div className="hidden lg:block">
          <h1 className="text-2xl font-bold text-[var(--color-foreground)]">Dashboard</h1>
          <p className="text-[var(--color-muted-foreground)]">
            Bem-vindo de volta, {user?.name || user?.email}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white font-bold">
            {(user?.name || user?.email || "U").charAt(0).toUpperCase()}
          </div>
        </div>
      </header>

      {/* Filtros */}
      <div className="mb-6 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex items-center gap-2 whitespace-nowrap min-w-max">
          <span className="text-xs sm:text-sm font-medium text-[var(--color-muted-foreground)]">
            Filtros ativos:
          </span>
          <span className="inline-flex items-center px-2 sm:px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-medium bg-[var(--color-muted)] border border-[var(--color-border)] text-[var(--color-foreground)]">
            Limpar Tudo
            <button className="ml-1.5 hover:text-[var(--color-destructive)]">
              <span className="sr-only">Remover filtro</span>
              &times;
            </button>
          </span>
          <span className="inline-flex items-center px-2 sm:px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-medium bg-[var(--color-muted)] border border-[var(--color-border)] text-[var(--color-foreground)]">
            Data início:{" "}
            {new Date().toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
            <button className="ml-1.5 hover:text-[var(--color-destructive)]">
              <span className="sr-only">Remover filtro</span>
              &times;
            </button>
          </span>
          <span className="inline-flex items-center px-2 sm:px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-medium bg-[var(--color-muted)] border border-[var(--color-border)] text-[var(--color-foreground)]">
            Todas as casas
            <button className="ml-1.5 hover:text-[var(--color-destructive)]">
              <span className="sr-only">Remover filtro</span>
              &times;
            </button>
          </span>
        </div>
      </div>

      {/* Metrics Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] p-4 sm:p-5 h-20 sm:h-24 animate-pulse"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-[var(--color-muted)] rounded-lg shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="h-2 sm:h-3 bg-[var(--color-muted)] rounded w-16 sm:w-20 mb-2" />
                  <div className="h-4 sm:h-6 bg-[var(--color-muted)] rounded w-20 sm:w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <MetricCard
            icon={<Users className="h-6 w-6 sm:h-8 sm:w-8" />}
            label="Registro"
            value={metrics?.total_registros || 0}
            iconColor="text-[var(--color-primary)]"
          />
          <MetricCard
            icon={<CreditCard className="h-6 w-6 sm:h-8 sm:w-8" />}
            label="FTD"
            value={metrics?.total_ftd || 0}
            iconColor="text-[var(--color-primary)]"
          />
          <MetricCard
            icon={<Receipt className="h-6 w-6 sm:h-8 sm:w-8" />}
            label="QFTD"
            value={metrics?.total_qftd || 0}
            iconColor="text-[var(--color-primary)]"
          />
          <MetricCard
            icon={<Building2 className="h-6 w-6 sm:h-8 sm:w-8" />}
            label="Depósito"
            value={formatCurrency(
              parseFloat(String(metrics?.total_depositos || 0))
            )}
            iconColor="text-[var(--color-primary)]"
          />
          <MetricCard
            icon={<TrendingUp className="h-6 w-6 sm:h-8 sm:w-8" />}
            label="REV"
            value={formatCurrency(parseFloat(String(metrics?.total_rev || 0)))}
            iconColor="text-[var(--color-primary)]"
          />
          <MetricCard
            icon={<DollarSign className="h-6 w-6 sm:h-8 sm:w-8" />}
            label="CPA"
            value={formatCurrency(parseFloat(String(metrics?.total_cpa || 0)))}
            iconColor="text-[var(--color-primary)]"
          />
          <MetricCard
            icon={<Coins className="h-6 w-6 sm:h-8 sm:w-8" />}
            label="REV + CPA"
            value={formatCurrency(
              parseFloat(String(metrics?.total_rev_cpa || 0))
            )}
            iconColor="text-[var(--color-secondary)]"
          />
        </div>
      )}
    </div>
  );
}
