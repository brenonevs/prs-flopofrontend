/**
 * @fileoverview Root Layout Component
 * 
 * Define a estrutura base da aplicação Next.js, incluindo metadados globais,
 * estilos CSS e componentes de notificação. Este layout é aplicado a todas as
 * páginas da aplicação e estabelece o design system baseado no Flopo Challenge.
 * 
 * @author Sistema de Anonimização
 * @version 1.0.0
 */

import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

/**
 * Metadados globais da aplicação definidos para SEO e acessibilidade.
 * Estes valores são utilizados pelo Next.js para gerar meta tags HTML.
 */
export const metadata: Metadata = {
  title: "Sistema de Anonimização - Flopo Challenge",
  description: "Sistema de Configuração de Regras de Anonimização de Documentos",
};

/**
 * Layout raiz da aplicação que define a estrutura HTML base.
 * 
 * Responsabilidades:
 * - Configurar estrutura HTML semântica
 * - Aplicar estilos globais e design system
 * - Incluir componentes de notificação (Toaster)
 * - Definir header de navegação principal
 * 
 * @param children - Componentes filhos renderizados nas páginas
 * @returns Estrutura HTML completa da aplicação
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="font-sans antialiased">
        <div className="min-h-screen bg-background">
          <header className="border-b border-border bg-card px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-foreground">
                Sistema de Anonimização
              </h1>
              <nav className="flex space-x-4">
                <a 
                  href="/relatorios" 
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Relatórios
                </a>
              </nav>
            </div>
          </header>
          <main className="container mx-auto px-6 py-8">
            {children}
          </main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
