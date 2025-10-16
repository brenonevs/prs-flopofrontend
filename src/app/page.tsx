/**
 * @fileoverview Home Page Component
 * 
 * Página principal do sistema de anonimização que serve como dashboard central.
 * Integra componentes de status do backend, navegação por abas e visualizações
 * hierárquicas das regras de anonimização.
 * 
 * @author Sistema de Anonimização
 * @version 1.0.0
 */

import BackendStatus from "@/components/BackendStatus";
import { DashboardTabs } from "@/components/dashboard/dashboard-tabs";

/**
 * Componente da página inicial que atua como dashboard principal.
 * 
 * Funcionalidades:
 * - Exibe status de conectividade com o backend
 * - Apresenta navegação por abas para diferentes seções
 * - Fornece visão geral do sistema de anonimização
 * 
 * @returns JSX da página inicial com dashboard integrado
 */
export default function Home() {
  return (
    <div className="space-y-6">
      <BackendStatus />
      
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard de Anonimização</h1>
        <p className="text-muted-foreground">
          Gerencie e visualize as regras de anonimização para documentos de forma hierárquica e intuitiva.
        </p>
      </div>

      <DashboardTabs />
    </div>
  );
}
