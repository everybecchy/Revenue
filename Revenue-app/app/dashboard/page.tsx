"use client";

import { useAuth } from "@/lib/auth-context";
import { api, DashboardMetrics } from "@/lib/api";
import useSWR from "swr";
import {
  Users,
  CreditCard,
  DollarSign,
  Receipt,
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
  iconColor = "text-primary",
}: MetricCardProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
      <div className={`${iconColor} text-3xl`}>{icon}</div>
      <div>
        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">
          {label}
        </p>
        <p className="text-2xl font-bold text-foreground">{value}</p>
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
            height={60}
            className="h-12 w-auto"
            priority
          />
        </div>
        <div className="hidden lg:block">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Bem-vindo de volta, {user?.name || user?.email}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold">
            {(user?.name || user?.email || "U").charAt(0).toUpperCase()}
          </div>
        </div>
      </header>

      {/* Metrics Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="bg-card rounded-xl border border-border p-5 h-24 animate-pulse"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-muted rounded-lg" />
                <div className="flex-1">
                  <div className="h-3 bg-muted rounded w-20 mb-2" />
                  <div className="h-6 bg-muted rounded w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <MetricCard
            icon={<Users className="h-8 w-8" />}
            label="Registro"
            value={metrics?.total_registros || 0}
            iconColor="text-primary"
          />
          <MetricCard
            icon={<CreditCard className="h-8 w-8" />}
            label="FTD"
            value={metrics?.total_ftd || 0}
            iconColor="text-primary"
          />
          <MetricCard
            icon={<Receipt className="h-8 w-8" />}
            label="QFTD"
            value={metrics?.total_qftd || 0}
            iconColor="text-primary"
          />
          <MetricCard
            icon={<DollarSign className="h-8 w-8" />}
            label="Saldo"
            value={formatCurrency(parseFloat(String(metrics?.total_cpa || 0)))}
            iconColor="text-primary"
          />
        </div>
      )}
    </div>
  );
}
