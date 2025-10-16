/**
 * @fileoverview Dashboard Tabs Component
 * 
 * Componente principal do dashboard que organiza diferentes visualizações
 * em abas navegáveis. Integra cards de overview, hierarquia, gráficos
 * e tabelas de dados em uma interface unificada.
 * 
 * @author Sistema de Anonimização
 * @version 1.0.0
 */

"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OverviewCards } from "./overview-cards"
import { HierarchyOverview } from "./hierarchy-overview"
import { RulesDistributionChart as CategoryChart } from "./trends-chart"
import { QuickStats } from "./quick-stats"
import { Button } from "@/components/ui/button"
import { IconEdit } from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import { ClassesTable } from "../tables/classes-table"
import { TypesTable } from "../tables/types-table"
import { LabelsTable } from "../tables/labels-table"
import { DataStructureDebug } from "../debug/data-structure"

/**
 * Componente de abas do dashboard principal.
 * 
 * Organiza diferentes seções do dashboard em abas navegáveis:
 * - Overview: Cards de estatísticas e visão geral
 * - Classes: Tabela de classes de documentos
 * - Tipos: Tabela de tipos de documentos
 * - Rótulos: Tabela de rótulos
 * - Debug: Ferramentas de desenvolvimento
 * 
 * @returns JSX com sistema de abas do dashboard
 */
export function DashboardTabs() {
  const router = useRouter()
  
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-5 h-12 bg-muted/50 rounded-xl p-1">
        <TabsTrigger 
          value="overview"
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md data-[state=active]:border-primary/20 transition-all duration-200 hover:bg-muted hover:shadow-sm hover:border-border focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 rounded-lg font-medium border border-transparent cursor-pointer"
        >
          Visão Geral
        </TabsTrigger>
        <TabsTrigger 
          value="classes"
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md data-[state=active]:border-primary/20 transition-all duration-200 hover:bg-muted hover:shadow-sm hover:border-border focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 rounded-lg font-medium border border-transparent cursor-pointer"
        >
          Classes
        </TabsTrigger>
        <TabsTrigger 
          value="types"
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md data-[state=active]:border-primary/20 transition-all duration-200 hover:bg-muted hover:shadow-sm hover:border-border focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 rounded-lg font-medium border border-transparent cursor-pointer"
        >
          Tipos
        </TabsTrigger>
        <TabsTrigger 
          value="labels"
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md data-[state=active]:border-primary/20 transition-all duration-200 hover:bg-muted hover:shadow-sm hover:border-border focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 rounded-lg font-medium border border-transparent cursor-pointer"
        >
          Rótulos
        </TabsTrigger>
        <TabsTrigger 
          value="debug"
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md data-[state=active]:border-primary/20 transition-all duration-200 hover:bg-muted hover:shadow-sm hover:border-border focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 rounded-lg font-medium border border-transparent cursor-pointer"
        >
          Debug
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="space-y-6 w-full mt-6 animate-in fade-in-50 duration-200">
        {/* Cards informacionais superiores */}
        <QuickStats />
        <OverviewCards />
        
        {/* Botão principal para editar regras */}
        <div className="flex justify-center">
          <Button
            onClick={() => router.push("/editar-regras")}
            size="lg"
            className="h-14 px-8 text-base font-medium bg-primary hover:bg-primary/90 transition-colors"
          >
            <IconEdit className="h-5 w-5 mr-2" />
            Editar Regras de Anonimização
          </Button>
        </div>
        
        {/* Gráfico de Distribuição */}
        <div className="w-full">
          <CategoryChart />
        </div>
        
        {/* Hierarquia */}
        <HierarchyOverview />
      </TabsContent>
      
      <TabsContent value="classes" className="mt-6 animate-in fade-in-50 duration-200">
        <ClassesTable />
      </TabsContent>
      
      <TabsContent value="types" className="mt-6 animate-in fade-in-50 duration-200">
        <TypesTable />
      </TabsContent>
      
      <TabsContent value="labels" className="mt-6 animate-in fade-in-50 duration-200">
        <LabelsTable />
      </TabsContent>

      <TabsContent value="debug" className="mt-6 animate-in fade-in-50 duration-200">
        <DataStructureDebug />
      </TabsContent>
    </Tabs>
  )
}
