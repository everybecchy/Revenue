"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Smartphone, Share, Plus, MoreVertical, Download } from "lucide-react";

export default function InstalarPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 bg-card border-b border-border p-4 z-10">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <Link
            href="/"
            className="p-2 rounded-lg hover:bg-muted text-muted-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo%20refinado%20BravoPanel%20Mar%2012%202026-ECztNMkP4MRp9EWbVxs4Fgwj4TJJTt.png"
            alt="Revenui"
            width={100}
            height={32}
            className="h-7 w-auto"
          />
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 lg:p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
            <Smartphone className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Instale o Revenue Panel
          </h1>
          <p className="text-muted-foreground">
            Tenha acesso rápido ao painel diretamente do seu celular
          </p>
        </div>

        {/* iOS Instructions */}
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="h-6 w-6 text-foreground" fill="currentColor">
                <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/>
              </svg>
            </div>
            <h2 className="text-lg font-bold text-foreground">iPhone / iPad (Safari)</h2>
          </div>

          <ol className="space-y-4">
            <li className="flex gap-3">
              <span className="shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">
                1
              </span>
              <div>
                <p className="text-foreground font-medium">Abra este site no Safari</p>
                <p className="text-sm text-muted-foreground">
                  O PWA funciona apenas no navegador Safari no iOS
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">
                2
              </span>
              <div className="flex-1">
                <p className="text-foreground font-medium">Toque no botão Compartilhar</p>
                <p className="text-sm text-muted-foreground mb-2">
                  Localizado na parte inferior da tela do Safari
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-2 bg-muted rounded-lg text-sm">
                  <Share className="h-5 w-5 text-primary" />
                  <span className="text-muted-foreground">Compartilhar</span>
                </div>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">
                3
              </span>
              <div className="flex-1">
                <p className="text-foreground font-medium">Selecione &quot;Adicionar à Tela de Início&quot;</p>
                <p className="text-sm text-muted-foreground mb-2">
                  Role para baixo no menu para encontrar a opção
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-2 bg-muted rounded-lg text-sm">
                  <Plus className="h-5 w-5 text-primary" />
                  <span className="text-muted-foreground">Adicionar à Tela de Início</span>
                </div>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">
                4
              </span>
              <div>
                <p className="text-foreground font-medium">Confirme tocando em &quot;Adicionar&quot;</p>
                <p className="text-sm text-muted-foreground">
                  O app será instalado na sua tela inicial
                </p>
              </div>
            </li>
          </ol>
        </div>

        {/* Android Instructions */}
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="h-6 w-6 text-success" fill="currentColor">
                <path d="M17.6 11.48L19.44 8.3C19.54 8.12 19.48 7.9 19.3 7.8C19.12 7.7 18.9 7.76 18.8 7.94L16.94 11.16C15.68 10.57 14.26 10.24 12.74 10.24C11.22 10.24 9.8 10.57 8.54 11.16L6.68 7.94C6.58 7.76 6.36 7.7 6.18 7.8C6 7.9 5.94 8.12 6.04 8.3L7.88 11.48C5.84 12.63 4.42 14.62 4.12 17H21.36C21.06 14.62 19.64 12.63 17.6 11.48ZM9.24 14.5C8.74 14.5 8.34 14.1 8.34 13.6C8.34 13.1 8.74 12.7 9.24 12.7C9.74 12.7 10.14 13.1 10.14 13.6C10.14 14.1 9.74 14.5 9.24 14.5ZM16.24 14.5C15.74 14.5 15.34 14.1 15.34 13.6C15.34 13.1 15.74 12.7 16.24 12.7C16.74 12.7 17.14 13.1 17.14 13.6C17.14 14.1 16.74 14.5 16.24 14.5Z"/>
              </svg>
            </div>
            <h2 className="text-lg font-bold text-foreground">Android (Chrome)</h2>
          </div>

          <ol className="space-y-4">
            <li className="flex gap-3">
              <span className="shrink-0 w-7 h-7 rounded-full bg-success/10 text-success font-bold text-sm flex items-center justify-center">
                1
              </span>
              <div>
                <p className="text-foreground font-medium">Abra este site no Chrome</p>
                <p className="text-sm text-muted-foreground">
                  Funciona melhor no navegador Google Chrome
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 w-7 h-7 rounded-full bg-success/10 text-success font-bold text-sm flex items-center justify-center">
                2
              </span>
              <div className="flex-1">
                <p className="text-foreground font-medium">Toque no menu (3 pontos)</p>
                <p className="text-sm text-muted-foreground mb-2">
                  Localizado no canto superior direito
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-2 bg-muted rounded-lg text-sm">
                  <MoreVertical className="h-5 w-5 text-success" />
                  <span className="text-muted-foreground">Menu</span>
                </div>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 w-7 h-7 rounded-full bg-success/10 text-success font-bold text-sm flex items-center justify-center">
                3
              </span>
              <div className="flex-1">
                <p className="text-foreground font-medium">Selecione &quot;Instalar aplicativo&quot; ou &quot;Adicionar à tela inicial&quot;</p>
                <p className="text-sm text-muted-foreground mb-2">
                  Dependendo da versão do Chrome
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-2 bg-muted rounded-lg text-sm">
                  <Download className="h-5 w-5 text-success" />
                  <span className="text-muted-foreground">Instalar aplicativo</span>
                </div>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="shrink-0 w-7 h-7 rounded-full bg-success/10 text-success font-bold text-sm flex items-center justify-center">
                4
              </span>
              <div>
                <p className="text-foreground font-medium">Confirme a instalação</p>
                <p className="text-sm text-muted-foreground">
                  O app será adicionado à sua gaveta de aplicativos
                </p>
              </div>
            </li>
          </ol>
        </div>

        {/* Benefits */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-6">
          <h3 className="font-bold text-foreground mb-4">Benefícios do App</h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-sm text-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Acesso rápido sem abrir o navegador
            </li>
            <li className="flex items-center gap-2 text-sm text-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Experiência em tela cheia como um app nativo
            </li>
            <li className="flex items-center gap-2 text-sm text-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Funciona offline para visualizar dados em cache
            </li>
            <li className="flex items-center gap-2 text-sm text-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Ícone personalizado na tela inicial
            </li>
          </ul>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-slate-800 font-medium py-3 px-6 rounded-lg hover:opacity-90 transition-opacity"
          >
            Voltar para o Login
          </Link>
        </div>
      </main>
    </div>
  );
}
