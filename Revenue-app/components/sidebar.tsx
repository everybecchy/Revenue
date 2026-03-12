"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  LayoutDashboard,
  Users,
  Building2,
  FileText,
  Wallet,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Shield,
} from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  isCollapsed: boolean;
}

function NavItem({ href, icon, label, isActive, isCollapsed }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
        isActive
          ? "bg-gradient-to-r from-[var(--color-primary)]/20 to-[var(--color-secondary)]/20 text-[var(--color-primary)] font-medium"
          : "text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]"
      }`}
      title={isCollapsed ? label : undefined}
    >
      <span className="shrink-0">{icon}</span>
      {!isCollapsed && <span className="truncate">{label}</span>}
    </Link>
  );
}

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { user, logout, isAdmin } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  return (
    <aside
      className={`hidden lg:flex flex-col h-screen bg-[var(--color-card)] border-r border-[var(--color-border)] transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Logo - Aumentado */}
      <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between">
        {!isCollapsed && (
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo%20refinado%20BravoPanel%20Mar%2012%202026-ECztNMkP4MRp9EWbVxs4Fgwj4TJJTt.png"
            alt="Revenue"
            width={180}
            height={60}
            className="h-14 w-auto"
            priority
          />
        )}
        {isCollapsed && (
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo%20refinado%20BravoPanel%20Mar%2012%202026-ECztNMkP4MRp9EWbVxs4Fgwj4TJJTt.png"
            alt="Revenue"
            width={40}
            height={40}
            className="h-10 w-auto mx-auto"
            priority
          />
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg hover:bg-[var(--color-muted)] text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
          aria-label={isCollapsed ? "Expandir menu" : "Recolher menu"}
        >
          {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>

      {/* Navigation - Itens um abaixo do outro sem categorias */}
      <nav className="flex-1 overflow-y-auto p-3">
        <div className="space-y-1">
          <NavItem
            href="/dashboard"
            icon={<LayoutDashboard className="h-5 w-5" />}
            label="Dashboard"
            isActive={pathname === "/dashboard"}
            isCollapsed={isCollapsed}
          />
          <NavItem
            href="/dashboard/relatorios"
            icon={<FileText className="h-5 w-5" />}
            label="Relatórios"
            isActive={pathname === "/dashboard/relatorios"}
            isCollapsed={isCollapsed}
          />
          <NavItem
            href="/dashboard/casas"
            icon={<Building2 className="h-5 w-5" />}
            label="Casas"
            isActive={pathname === "/dashboard/casas"}
            isCollapsed={isCollapsed}
          />
          <NavItem
            href="/dashboard/saques"
            icon={<Wallet className="h-5 w-5" />}
            label="Saques"
            isActive={pathname === "/dashboard/saques"}
            isCollapsed={isCollapsed}
          />
          
          {/* Itens Admin */}
          {isAdmin && (
            <>
              <NavItem
                href="/dashboard/usuarios"
                icon={<Users className="h-5 w-5" />}
                label="Usuários"
                isActive={pathname === "/dashboard/usuarios"}
                isCollapsed={isCollapsed}
              />
              <NavItem
                href="/dashboard/admin/casas"
                icon={<Shield className="h-5 w-5" />}
                label="Gerenciar Casas"
                isActive={pathname === "/dashboard/admin/casas"}
                isCollapsed={isCollapsed}
              />
            </>
          )}
        </div>
      </nav>

      {/* Theme Toggle & User Info & Logout */}
      <div className="p-3 border-t border-[var(--color-border)] space-y-3">
        {/* Theme Toggle */}
        <div className={`flex ${isCollapsed ? "justify-center" : "justify-end"}`}>
          <ThemeToggle />
        </div>
        
        {!isCollapsed && (
          <div className="px-3 py-2">
            <p className="text-sm font-medium text-[var(--color-foreground)] truncate">{user?.name || user?.email}</p>
            <p className="text-xs text-[var(--color-muted-foreground)] capitalize">{user?.role}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-[var(--color-destructive)] hover:bg-[var(--color-destructive)]/10 transition-colors ${
            isCollapsed ? "justify-center" : ""
          }`}
          title={isCollapsed ? "Sair" : undefined}
        >
          <LogOut className="h-5 w-5" />
          {!isCollapsed && <span>Sair</span>}
        </button>
      </div>
    </aside>
  );
}
