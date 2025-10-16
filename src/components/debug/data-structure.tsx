"use client"

import { useDocumentClasses } from "@/hooks/useDocumentClasses"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function DataStructureDebug() {
  const { data: documentClasses, loading, error } = useDocumentClasses()

  if (loading) return <div>Carregando dados...</div>
  if (error) return <div>Erro: {error}</div>

  return (
    <Card>
      <CardHeader>
        <CardTitle>Debug: Estrutura dos Dados</CardTitle>
        <CardDescription>
          Verificação da estrutura dos dados retornados pelo backend
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Total de Classes: {documentClasses.length}</h4>
            {documentClasses.map((docClass, index) => (
              <div key={docClass.id} className="border rounded p-3 mb-2">
                <div className="font-medium">{index + 1}. {docClass.name}</div>
                <div className="text-sm text-muted-foreground">
                  ID: {docClass.id} | Regra: {docClass.rule || 'Não definida'}
                </div>
                <div className="text-sm text-muted-foreground">
                  Types: {(docClass.documentTypes || docClass.types || []).length}
                </div>
                {(docClass.documentTypes || docClass.types || []).length > 0 && (
                  <div className="ml-4 mt-2">
                    {(docClass.documentTypes || docClass.types || []).map((docType, typeIndex) => (
                      <div key={`${docClass.id}-${docType.id}-${typeIndex}`} className="border-l-2 border-gray-200 pl-2 mb-1">
                        <div className="text-sm">
                          {typeIndex + 1}. {docType.name} 
                          <Badge variant="outline" className="ml-2">
                            {(docType.labels || []).length} rótulos
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
