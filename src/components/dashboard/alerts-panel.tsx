"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { IconAlertTriangle, IconCircleCheck, IconInfoCircle, IconX } from "@tabler/icons-react"
import { useDocumentClasses } from "@/hooks/useDocumentClasses"
import { AnonymizationRule } from "@/types"

export function AlertsPanel() {
  const { data: documentClasses, loading, error } = useDocumentClasses()

  if (loading) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconAlertTriangle className="h-5 w-5" />
            Alertas e Notificações
          </CardTitle>
          <CardDescription>Carregando dados...</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconAlertTriangle className="h-5 w-5" />
            Alertas e Notificações
          </CardTitle>
          <CardDescription>Erro ao carregar dados</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            Erro: {error}
          </div>
        </CardContent>
      </Card>
    )
  }

  const alerts = []
  
  const classesWithoutRules = documentClasses.filter(docClass => !docClass.rule)
  if (classesWithoutRules.length > 0) {
    alerts.push({
      type: "warning",
      title: "Classes sem regras",
      description: `${classesWithoutRules.length} classes não possuem regras de anonimização definidas`,
      count: classesWithoutRules.length
    })
  }

  const restrictedTypes = documentClasses.flatMap(docClass => 
    ((docClass as any).types || docClass.documentTypes || []).filter((docType: any) => docType.rule === AnonymizationRule.RESTRICTED)
  )
  if (restrictedTypes.length > 0) {
    alerts.push({
      type: "info",
      title: "Tipos com restrições",
      description: `${restrictedTypes.length} tipos possuem regras restritivas`,
      count: restrictedTypes.length
    })
  }

  const blockedLabels = documentClasses.flatMap(docClass => 
    ((docClass as any).types || docClass.documentTypes || []).flatMap((docType: any) => 
      (docType.labels || []).filter((label: any) => label.rule === AnonymizationRule.NOT_ALLOWED)
    )
  )
  if (blockedLabels.length > 0) {
    alerts.push({
      type: "error",
      title: "Rótulos bloqueados",
      description: `${blockedLabels.length} campos estão totalmente bloqueados`,
      count: blockedLabels.length
    })
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "warning":
        return IconAlertTriangle
      case "error":
        return IconX
      case "info":
        return IconInfoCircle
      default:
        return IconCircleCheck
    }
  }

  const getAlertVariant = (type: string) => {
    switch (type) {
      case "warning":
        return "default"
      case "error":
        return "destructive"
      case "info":
        return "default"
      default:
        return "default"
    }
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconAlertTriangle className="h-5 w-5" />
          Alertas e Notificações
        </CardTitle>
        <CardDescription>
          Status atual do sistema e itens que requerem atenção
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1 space-y-3">
          {alerts.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <Alert className="border-green-200 bg-green-50">
                <IconCircleCheck className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Sistema funcionando normalmente. Todas as regras estão adequadamente configuradas.
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            <div className="space-y-3 flex-1">
              {alerts.slice(0, 3).map((alert, index) => {
                const Icon = getAlertIcon(alert.type)
                return (
                  <Alert key={index} variant={getAlertVariant(alert.type)} className="py-3">
                    <Icon className="h-4 w-4" />
                    <AlertDescription>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-sm">{alert.title}</div>
                          <div className="text-xs text-muted-foreground mt-1">{alert.description}</div>
                        </div>
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {alert.count}
                        </Badge>
                      </div>
                    </AlertDescription>
                  </Alert>
                )
              })}
              {alerts.length > 3 && (
                <div className="text-center py-2">
                  <span className="text-xs text-muted-foreground">
                    +{alerts.length - 3} alertas adicionais
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
        
        {alerts.length > 0 && (
          <div className="mt-4 pt-3 border-t">
            <Button variant="outline" size="sm" className="w-full text-xs">
              Ver todos os alertas ({alerts.length})
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
