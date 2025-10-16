"use client"

import { IconShield, IconShieldCheck, IconShieldX, IconTrendingUp } from "@tabler/icons-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useDocumentClasses } from "@/hooks/useDocumentClasses"
import { AnonymizationRule } from "@/types"

export function OverviewCards() {
  const { data: documentClasses, loading, error } = useDocumentClasses()

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      
      if (docClass.rule === AnonymizationRule.ALLOWED) acc.allowed++
      if (docClass.rule === AnonymizationRule.RESTRICTED) acc.restricted++
      if (docClass.rule === AnonymizationRule.NOT_ALLOWED) acc.notAllowed++
      
      (docClass.types || docClass.documentTypes || []).forEach(docType => {
        acc.totalTypes++
        if (docType.rule === AnonymizationRule.ALLOWED) acc.allowed++
        if (docType.rule === AnonymizationRule.RESTRICTED) acc.restricted++
        if (docType.rule === AnonymizationRule.NOT_ALLOWED) acc.notAllowed++
        
        (docType.labels || []).forEach(label => {
          acc.totalLabels++
          if (label.rule === AnonymizationRule.ALLOWED) acc.allowed++
          if (label.rule === AnonymizationRule.RESTRICTED) acc.restricted++
          if (label.rule === AnonymizationRule.NOT_ALLOWED) acc.notAllowed++
        })
      })
      
      return acc
    },
    { totalClasses: 0, totalTypes: 0, totalLabels: 0, allowed: 0, restricted: 0, notAllowed: 0 }
  )

  const totalRules = stats.allowed + stats.restricted + stats.notAllowed
  const allowedPercentage = totalRules > 0 ? Math.round((stats.allowed / totalRules) * 100) : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="border-l-4 border-l-green-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Regras</CardTitle>
          <IconShield className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalRules}</div>
          <p className="text-xs text-muted-foreground">
            {stats.totalClasses} classes • {stats.totalTypes} tipos • {stats.totalLabels} rótulos
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-green-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Permitidas</CardTitle>
          <IconShieldCheck className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.allowed}</div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {allowedPercentage}%
            </Badge>
            <p className="text-xs text-muted-foreground">do total</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-yellow-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Restritas</CardTitle>
          <IconShield className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">{stats.restricted}</div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              {totalRules > 0 ? Math.round((stats.restricted / totalRules) * 100) : 0}%
            </Badge>
            <p className="text-xs text-muted-foreground">com restrições</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-red-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Bloqueadas</CardTitle>
          <IconShieldX className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{stats.notAllowed}</div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-red-100 text-red-800">
              {totalRules > 0 ? Math.round((stats.notAllowed / totalRules) * 100) : 0}%
            </Badge>
            <p className="text-xs text-muted-foreground">totalmente bloqueadas</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
