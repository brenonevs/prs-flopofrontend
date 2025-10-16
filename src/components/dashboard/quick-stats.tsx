"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { IconRefresh, IconDownload, IconShare } from "@tabler/icons-react"
import { useDocumentClasses } from "@/hooks/useDocumentClasses"
import { AnonymizationRule } from "@/types"

export function QuickStats() {
  const { data: documentClasses, loading, error } = useDocumentClasses()

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-muted rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="col-span-full">
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              Erro ao carregar dados: {error}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const stats = documentClasses.reduce(
    (acc, docClass) => {
      acc.totalClasses++
      if (docClass.rule) acc.totalRules++
      
      (docClass.types || docClass.documentTypes || []).forEach(docType => {
        acc.totalTypes++
        if (docType.rule) acc.totalRules++
        
        (docType.labels || []).forEach(label => {
          acc.totalLabels++
          if (label.rule) acc.totalRules++
        })
      })
      
      return acc
    },
    { totalClasses: 0, totalTypes: 0, totalLabels: 0, totalRules: 0 }
  )

  const complianceRate = stats.totalRules > 0 
    ? Math.round((stats.totalRules / (stats.totalClasses + stats.totalTypes + stats.totalLabels)) * 100)
    : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Taxa de Conformidade</CardTitle>
          <Badge variant={complianceRate >= 80 ? "default" : complianceRate >= 60 ? "secondary" : "destructive"}>
            {complianceRate}%
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalRules}</div>
          <p className="text-xs text-muted-foreground">
            regras definidas de {stats.totalClasses + stats.totalTypes + stats.totalLabels} itens
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Classes</CardTitle>
          <Badge variant="outline">{stats.totalClasses}</Badge>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalClasses}</div>
          <p className="text-xs text-muted-foreground">
            classes de documentos
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tipos</CardTitle>
          <Badge variant="outline">{stats.totalTypes}</Badge>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalTypes}</div>
          <p className="text-xs text-muted-foreground">
            tipos de documentos
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Rótulos</CardTitle>
          <Badge variant="outline">{stats.totalLabels}</Badge>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalLabels}</div>
          <p className="text-xs text-muted-foreground">
            campos específicos
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
