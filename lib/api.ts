const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

type RequestOptions = {
  method?: string;
  body?: unknown;
  token?: string | null;
};

export async function api<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body, token } = options;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Erro desconhecido" }));
    throw new Error(error.error || `HTTP error! status: ${res.status}`);
  }

  return res.json();
}

// Types
export interface User {
  id: number;
  email: string;
  name: string | null;
  instagram: string | null;
  role: "admin" | "affiliate";
  status: "active" | "inactive" | "blocked";
  created_at: string;
  registros?: number;
  ftd?: number;
  qftd?: number;
  depositos?: number;
  rev?: number;
  cpa?: number;
}

export interface BettingHouse {
  id: number;
  name: string;
  cpa_percentage: number;
  affiliate_link: string | null;
  logo_url: string | null;
  status: "active" | "inactive";
  created_at: string;
}

export interface AffiliateHouse {
  id: number;
  house_id: number;
  house_name: string;
  cpa_agreement: number;
  custom_link: string | null;
  is_active: boolean;
}

export interface DashboardMetrics {
  total_registros: number;
  total_ftd: number;
  total_qftd: number;
  total_depositos: number;
  total_rev: number;
  total_cpa: number;
  total_rev_cpa: number;
}

export interface CpaRecord {
  id: number;
  user_id: number;
  house_id: number;
  house_name: string;
  user_email: string;
  user_name: string;
  player_name: string | null;
  cpa_value: number;
  deposit_value: number;
  notes: string | null;
  status: "pending" | "approved" | "rejected" | "paid";
  created_at: string;
}

export interface Withdrawal {
  id: number;
  user_id: number;
  user_email: string;
  user_name: string;
  amount: number;
  pix_key: string;
  pix_type: "cpf" | "cnpj" | "email" | "phone" | "random";
  status: "pending" | "approved" | "rejected" | "paid";
  notes: string | null;
  processed_at: string | null;
  created_at: string;
}
