"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useTheme } from "@/components/theme-provider";
import {
  Menu,
  Plus,
  X,
  LayoutDashboard,
  Users,
  Building2,
  Shield,
  LogOut,
  Wallet,
  Sun,
  Moon,
} from "lucide-react";
import NewCpaModal from "./new-cpa-modal";

export default function MobileNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNewCpaOpen, setIsNewCpaOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  const menuItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/dashboard/casas", icon: Building2, label: "Casas" },
    { href: "/dashboard/saques", icon: Wallet, label: "Saques" },
    ...(isAdmin
      ? [
          { href: "/dashboard/usuarios", icon: Users, label: "Usuários" },
          { href: "/dashboard/admin/casas", icon: Shield, label: "Gerenciar Casas" },
        ]
      : []),
  ];

  return (
    <>
      {/* Bottom Navigation - Grid de quadradinhos */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border safe-bottom z-40">
        <div className="grid grid-cols-5 gap-1 p-2">
          {/* Menu */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className={`flex flex-col items-center justify-center gap-1 p-2 rounded-xl min-h-[60px] ${
              isMenuOpen ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <Menu className="h-5 w-5 shrink-0" />
            <span className="text-[10px] font-medium leading-tight text-center">Menu</span>
          </button>

          {/* Dashboard */}
          <Link
            href="/dashboard"
            className={`flex flex-col items-center justify-center gap-1 p-2 rounded-xl min-h-[60px] ${
              pathname === "/dashboard" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <LayoutDashboard className="h-5 w-5 shrink-0" />
            <span className="text-[10px] font-medium leading-tight text-center">Dashboard</span>
          </Link>

          {/* Novo CPA - Botão Central */}
          <button
            onClick={() => setIsNewCpaOpen(true)}
            className="flex items-center justify-center rounded-xl bg-gradient-to-r from-primary to-secondary text-slate-800 shadow-lg hover:opacity-90 transition-opacity min-h-[60px]"
          >
            <Plus className="h-6 w-6" />
          </button>

          {/* Casas */}
          <Link
            href="/dashboard/casas"
            className={`flex flex-col items-center justify-center gap-1 p-2 rounded-xl min-h-[60px] ${
              pathname === "/dashboard/casas" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <Building2 className="h-5 w-5 shrink-0" />
            <span className="text-[10px] font-medium leading-tight text-center">Casas</span>
          </Link>

          {/* Saques */}
          <Link
            href="/dashboard/saques"
            className={`flex flex-col items-center justify-center gap-1 p-2 rounded-xl min-h-[60px] ${
              pathname === "/dashboard/saques" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <Wallet className="h-5 w-5 shrink-0" />
            <span className="text-[10px] font-medium leading-tight text-center">Saques</span>
          </Link>
        </div>
      </nav>

      {/* Mobile Menu Drawer - Grid responsivo */}
      {isMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="lg:hidden fixed inset-0 bg-foreground/50 z-50"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Menu Content */}
          <div className="lg:hidden fixed inset-x-0 top-0 bg-card z-50 animate-slideDown safe-top rounded-b-2xl shadow-xl max-h-[85vh] overflow-y-auto">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo%20refinado%20BravoPanel%20Mar%2012%202026-ECztNMkP4MRp9EWbVxs4Fgwj4TJJTt.png"
                alt="Revenue"
                width={180}
                height={60}
                className="h-14 w-auto"
                priority
              />
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-muted text-muted-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* User Info */}
              <div className="bg-muted rounded-xl p-4">
                <p className="font-medium text-foreground">{user?.name || user?.email}</p>
                <p className="text-sm text-muted-foreground capitalize">{user?.role}</p>
              </div>

              {/* Menu Items - Grid de quadradinhos */}
              <div className="grid grid-cols-3 gap-3">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl transition-colors min-h-[90px] ${
                        isActive
                          ? "bg-primary/10 text-primary border-2 border-primary"
                          : "bg-muted text-foreground hover:bg-muted/80 border-2 border-transparent"
                      }`}
                    >
                      <Icon className="h-6 w-6 shrink-0" />
                      <span className="text-xs font-medium text-center leading-tight">{item.label}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="flex items-center justify-center gap-3 w-full p-4 rounded-xl bg-muted text-foreground hover:bg-muted/80 transition-colors"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                <span className="font-medium">{theme === "dark" ? "Modo Claro" : "Modo Escuro"}</span>
              </button>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-3 w-full p-4 rounded-xl text-destructive bg-destructive/10 hover:bg-destructive/20 transition-colors"
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
