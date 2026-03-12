"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  Menu,
  Home,
  Plus,
  FileText,
  Wallet,
  X,
  LayoutDashboard,
  Users,
  Building2,
  Shield,
  LogOut,
} from "lucide-react";
import NewCpaModal from "./new-cpa-modal";

export default function MobileNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNewCpaOpen, setIsNewCpaOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout, isAdmin } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  return (
    <>
      {/* Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border safe-bottom z-40">
        <div className="flex items-center justify-around py-2">
          {/* Menu */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg ${
              isMenuOpen ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Menu className="h-5 w-5" />
            <span className="text-xs">Menu</span>
          </button>

          {/* Home */}
          <Link
            href="/dashboard"
            className={`flex flex-col items-center gap-1 p-2 rounded-lg ${
              pathname === "/dashboard" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs">Home</span>
          </Link>

          {/* Novo CPA - Botão Central */}
          <button
            onClick={() => setIsNewCpaOpen(true)}
            className="flex items-center justify-center w-14 h-14 -mt-6 rounded-full bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:opacity-90 transition-opacity"
          >
            <Plus className="h-7 w-7" />
          </button>

          {/* Relatórios */}
          <Link
            href="/dashboard/relatorios"
            className={`flex flex-col items-center gap-1 p-2 rounded-lg ${
              pathname === "/dashboard/relatorios" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <FileText className="h-5 w-5" />
            <span className="text-xs">Relatórios</span>
          </Link>

          {/* Saques */}
          <Link
            href="/dashboard/saques"
            className={`flex flex-col items-center gap-1 p-2 rounded-lg ${
              pathname === "/dashboard/saques" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Wallet className="h-5 w-5" />
            <span className="text-xs">Saques</span>
          </Link>
        </div>
      </nav>

      {/* Mobile Menu Drawer - Abre de cima para baixo */}
      {isMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="lg:hidden fixed inset-0 bg-foreground/50 z-50"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Menu Content */}
          <div className="lg:hidden fixed inset-x-0 top-0 bg-card z-50 animate-slideDown safe-top rounded-b-2xl shadow-xl max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo%20refinado%20BravoPanel%20Mar%2012%202026-ECztNMkP4MRp9EWbVxs4Fgwj4TJJTt.png"
                alt="Revenui"
                width={120}
                height={40}
                className="h-8 w-auto"
              />
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-muted text-muted-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="p-4 space-y-6">
              {/* User Info */}
              <div className="bg-muted rounded-lg p-4">
                <p className="font-medium text-foreground">{user?.name || user?.email}</p>
                <p className="text-sm text-muted-foreground capitalize">{user?.role}</p>
              </div>

              {/* Menu Principal */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Menu Principal
                </p>
                <div className="space-y-1">
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                      pathname === "/dashboard"
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    <span>Overview</span>
                  </Link>
                </div>
              </div>

              {/* Relatórios */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Relatórios
                </p>
                <div className="space-y-1">
                  <Link
                    href="/dashboard/relatorios"
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                      pathname === "/dashboard/relatorios"
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    <FileText className="h-5 w-5" />
                    <span>Relatórios</span>
                  </Link>
                  <Link
                    href="/dashboard/casas"
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                      pathname === "/dashboard/casas"
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    <Building2 className="h-5 w-5" />
                    <span>Detalhados por Casa</span>
                  </Link>
                  <Link
                    href="/dashboard/saques"
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                      pathname === "/dashboard/saques"
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    <Wallet className="h-5 w-5" />
                    <span>Saques</span>
                  </Link>
                </div>
              </div>

              {/* Administração */}
              {isAdmin && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Administração
                  </p>
                  <div className="space-y-1">
                    <Link
                      href="/dashboard/usuarios"
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                        pathname === "/dashboard/usuarios"
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-muted"
                      }`}
                    >
                      <Users className="h-5 w-5" />
                      <span>Usuários</span>
                    </Link>
                    <Link
                      href="/dashboard/admin/casas"
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                        pathname === "/dashboard/admin/casas"
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-muted"
                      }`}
                    >
                      <Shield className="h-5 w-5" />
                      <span>Gerenciar Casas</span>
                    </Link>
                  </div>
                </div>
              )}

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-3 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Sair</span>
              </button>
            </nav>
          </div>
        </>
      )}

      {/* New CPA Modal */}
      <NewCpaModal isOpen={isNewCpaOpen} onClose={() => setIsNewCpaOpen(false)} />
    </>
  );
}
