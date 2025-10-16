"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { IconChevronRight, IconDatabase, IconFileText, IconTag } from "@tabler/icons-react"
import { useDocumentClasses } from "@/hooks/useDocumentClasses"
import { AnonymizationRule, RULE_LABELS } from "@/types"
import { useState } from "react"

export function HierarchyOverview() {
  const [expandedClass, setExpandedClass] = useState<string | null>(null)
  const [expandedType, setExpandedType] = useState<string | null>(null)
  const { data: documentClasses, loading, error } = useDocumentClasses()

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconDatabase className="h-5 w-5" />
            Hierarquia de Documentos
          </CardTitle>
          <CardDescription>Carregando dados...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconDatabase className="h-5 w-5" />
            Hierarquia de Documentos
          </CardTitle>
          <CardDescription>Erro ao carregar dados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Erro: {error}
          </div>
        </CardContent>
      </Card>
    )
  }

  const getRuleBadgeVariant = (rule: AnonymizationRule) => {
    switch (rule) {
      case AnonymizationRule.ALLOWED:
        return "default"
      case AnonymizationRule.RESTRICTED:
        return "secondary"
      case AnonymizationRule.NOT_ALLOWED:
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconDatabase className="h-5 w-5" />
          Hierarquia de Documentos
        </CardTitle>
        <CardDescription>
          Visualização hierárquica das classes, tipos e rótulos de documentos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {documentClasses.map((docClass) => (
            <div key={docClass.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedClass(
                      expandedClass === docClass.id ? null : docClass.id
                    )}
                  >
                    <IconChevronRight 
                      className={`h-4 w-4 transition-transform ${
                        expandedClass === docClass.id ? 'rotate-90' : ''
                      }`} 
                    />
                  </Button>
                  <IconDatabase className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">{docClass.name}</span>
                  {docClass.rule && (
                    <Badge variant={getRuleBadgeVariant(docClass.rule)}>
                      {RULE_LABELS[docClass.rule]}
                      {docClass.days && ` (${docClass.days}d)`}
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {(docClass.documentTypes || docClass.types || []).length} tipos
                </div>
              </div>

              {expandedClass === docClass.id && (docClass.documentTypes || docClass.types) && (
                <div className="mt-4 ml-8 space-y-3">
                  {(docClass.documentTypes || docClass.types || []).map((docType) => (
                    <div key={docType.id} className="border-l-2 border-gray-200 pl-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setExpandedType(
                              expandedType === docType.id ? null : docType.id
                            )}
                          >
                            <IconChevronRight 
                              className={`h-4 w-4 transition-transform ${
                                expandedType === docType.id ? 'rotate-90' : ''
                              }`} 
                            />
                          </Button>
                          <IconFileText className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium">{docType.name}</span>
                          {docType.rule && (
                            <Badge variant={getRuleBadgeVariant(docType.rule)}>
                              {RULE_LABELS[docType.rule]}
                              {docType.days && ` (${docType.days}d)`}
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {docType.labels?.length || 0} rótulos
                        </div>
                      </div>

                      {expandedType === docType.id && docType.labels && (
                        <div className="mt-3 ml-8 space-y-2">
                          {docType.labels.map((label, labelIndex) => (
                            <div key={`${docType.id}-${label.id}-${labelIndex}`} className="flex items-center gap-3 py-1">
                              <IconTag className="h-3 w-3 text-gray-500" />
                              <span className="text-xs">{label.name}</span>
                              {label.rule && (
                                <Badge variant={getRuleBadgeVariant(label.rule)}>
                                  {RULE_LABELS[label.rule]}
                                  {label.days && ` (${label.days}d)`}
                                </Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
