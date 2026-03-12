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
import { ThemeToggle } from "./theme-toggle";

export default function MobileNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNewCpaOpen, setIsNewCpaOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout, isAdmin } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  const menuItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/dashboard/relatorios", icon: FileText, label: "Relatórios" },
    { href: "/dashboard/casas", icon: Building2, label: "Casas" },
    { href: "/dashboard/saques", icon: Wallet, label: "Saques" },
  ];

  const adminItems = [
    { href: "/dashboard/usuarios", icon: Users, label: "Usuários" },
    { href: "/dashboard/admin/casas", icon: Shield, label: "Gerenciar Casas" },
  ];

  return (
    <>
      {/* Bottom Navigation - Grid de quadradinhos */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[var(--color-card)] border-t border-[var(--color-border)] safe-bottom z-40">
        <div className="grid grid-cols-5 gap-1 p-2">
          {/* Menu */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className={`flex flex-col items-center justify-center gap-1 p-2 rounded-lg min-h-[60px] ${
              isMenuOpen ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]" : "text-[var(--color-muted-foreground)]"
            }`}
          >
            <Menu className="h-5 w-5 shrink-0" />
            <span className="text-[10px] leading-tight text-center">Menu</span>
          </button>

          {/* Home */}
          <Link
            href="/dashboard"
            className={`flex flex-col items-center justify-center gap-1 p-2 rounded-lg min-h-[60px] ${
              pathname === "/dashboard" ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]" : "text-[var(--color-muted-foreground)]"
            }`}
          >
            <Home className="h-5 w-5 shrink-0" />
            <span className="text-[10px] leading-tight text-center">Home</span>
          </Link>

          {/* Novo CPA - Botão Central */}
          <button
            onClick={() => setIsNewCpaOpen(true)}
            className="flex items-center justify-center w-full h-full rounded-lg bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white shadow-lg"
          >
            <Plus className="h-6 w-6" />
          </button>

          {/* Relatórios */}
          <Link
            href="/dashboard/relatorios"
            className={`flex flex-col items-center justify-center gap-1 p-2 rounded-lg min-h-[60px] ${
              pathname === "/dashboard/relatorios" ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]" : "text-[var(--color-muted-foreground)]"
            }`}
          >
            <FileText className="h-5 w-5 shrink-0" />
            <span className="text-[10px] leading-tight text-center">Relatórios</span>
          </Link>

          {/* Saques */}
          <Link
            href="/dashboard/saques"
            className={`flex flex-col items-center justify-center gap-1 p-2 rounded-lg min-h-[60px] ${
              pathname === "/dashboard/saques" ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]" : "text-[var(--color-muted-foreground)]"
            }`}
          >
            <Wallet className="h-5 w-5 shrink-0" />
            <span className="text-[10px] leading-tight text-center">Saques</span>
          </Link>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {isMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-50"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Menu Content */}
          <div className="lg:hidden fixed inset-x-0 top-0 bg-[var(--color-card)] z-50 animate-slideDown safe-top rounded-b-2xl shadow-xl max-h-[85vh] overflow-y-auto">
            <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo%20refinado%20BravoPanel%20Mar%2012%202026-ECztNMkP4MRp9EWbVxs4Fgwj4TJJTt.png"
                alt="Revenue"
                width={160}
                height={50}
                className="h-12 w-auto"
                priority
              />
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-[var(--color-muted)] text-[var(--color-muted-foreground)]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-4 space-y-4">
              {/* User Info */}
              <div className="bg-[var(--color-muted)] rounded-xl p-4">
                <p className="font-medium text-[var(--color-foreground)]">{user?.name || user?.email}</p>
                <p className="text-sm text-[var(--color-muted-foreground)] capitalize">{user?.role}</p>
              </div>

              {/* Menu Items em Grid */}
              <div className="grid grid-cols-2 gap-3">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl transition-colors min-h-[100px] ${
                      pathname === item.href
                        ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)] border-2 border-[var(--color-primary)]"
                        : "bg-[var(--color-muted)] text-[var(--color-foreground)] hover:bg-[var(--color-border)]"
                    }`}
                  >
                    <item.icon className="h-6 w-6" />
                    <span className="text-sm font-medium text-center">{item.label}</span>
                  </Link>
                ))}
              </div>

              {/* Admin Items */}
              {isAdmin && (
                <div className="grid grid-cols-2 gap-3">
                  {adminItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl transition-colors min-h-[100px] ${
                        pathname === item.href
                          ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)] border-2 border-[var(--color-primary)]"
                          : "bg-[var(--color-muted)] text-[var(--color-foreground)] hover:bg-[var(--color-border)]"
                      }`}
                    >
                      <item.icon className="h-6 w-6" />
                      <span className="text-sm font-medium text-center">{item.label}</span>
                    </Link>
                  ))}
                </div>
              )}

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-3 w-full p-4 rounded-xl bg-[var(--color-destructive)]/10 text-[var(--color-destructive)] hover:bg-[var(--color-destructive)]/20 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Sair</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* New CPA Modal */}
      <NewCpaModal isOpen={isNewCpaOpen} onClose={() => setIsNewCpaOpen(false)} />
    </>
  );
}
