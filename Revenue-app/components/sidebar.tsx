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
  ChevronDown,
  Shield,
} from "lucide-react";

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
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
        isActive
          ? "bg-gradient-to-r from-primary/20 to-secondary/20 text-primary font-medium"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
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
  const [isHousesOpen, setIsHousesOpen] = useState(true);
  const pathname = usePathname();
  const { user, logout, isAdmin } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  return (
    <aside
      className={`hidden lg:flex flex-col h-screen bg-card border-r border-border transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Logo */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!isCollapsed && (
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo%20refinado%20BravoPanel%20Mar%2012%202026-ECztNMkP4MRp9EWbVxs4Fgwj4TJJTt.png"
            alt="Revenui"
            width={120}
            height={40}
            className="h-8 w-auto"
          />
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          aria-label={isCollapsed ? "Expandir menu" : "Recolher menu"}
        >
          {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-6">
        {/* Menu Principal */}
        <div>
          {!isCollapsed && (
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3">
              Menu Principal
            </p>
          )}
          <div className="space-y-1">
            <NavItem
              href="/dashboard"
              icon={<LayoutDashboard className="h-5 w-5" />}
              label="Overview"
              isActive={pathname === "/dashboard"}
              isCollapsed={isCollapsed}
            />
          </div>
        </div>

        {/* Relatórios */}
        <div>
          {!isCollapsed && (
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3">
              Relatórios
            </p>
          )}
          <div className="space-y-1">
            <NavItem
              href="/dashboard/relatorios"
              icon={<FileText className="h-5 w-5" />}
              label="Relatórios"
              isActive={pathname === "/dashboard/relatorios"}
              isCollapsed={isCollapsed}
            />

            {/* Detalhados por Casa */}
            {!isCollapsed && (
              <div>
                <button
                  onClick={() => setIsHousesOpen(!isHousesOpen)}
                  className="flex items-center justify-between w-full px-3 py-2.5 text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5" />
                    <span>Detalhados por Casa</span>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${isHousesOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isHousesOpen && (
                  <div className="ml-8 mt-1 space-y-1">
                    <Link
                      href="/dashboard/casas"
                      className="block px-3 py-2 text-sm text-muted-foreground hover:text-primary border-l-2 border-transparent hover:border-primary transition-all"
                    >
                      Ver Todas as Casas
                    </Link>
                  </div>
                )}
              </div>
            )}
            {isCollapsed && (
              <NavItem
                href="/dashboard/casas"
                icon={<Building2 className="h-5 w-5" />}
                label="Casas"
                isActive={pathname === "/dashboard/casas"}
                isCollapsed={isCollapsed}
              />
            )}

            <NavItem
              href="/dashboard/saques"
              icon={<Wallet className="h-5 w-5" />}
              label="Saques"
              isActive={pathname === "/dashboard/saques"}
              isCollapsed={isCollapsed}
            />
          </div>
        </div>

        {/* Administração - apenas para admin */}
        {isAdmin && (
          <div>
            {!isCollapsed && (
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3">
                Administração
              </p>
            )}
            <div className="space-y-1">
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
            </div>
          </div>
        )}
      </nav>

      {/* User Info & Logout */}
      <div className="p-3 border-t border-border">
        {!isCollapsed && (
          <div className="px-3 py-2 mb-2">
            <p className="text-sm font-medium text-foreground truncate">{user?.name || user?.email}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-destructive hover:bg-destructive/10 transition-colors ${
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
