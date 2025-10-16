"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { IconSearch, IconEdit, IconTrash, IconEye } from "@tabler/icons-react"
import { useDocumentClasses } from "@/hooks/useDocumentClasses"
import { AnonymizationRule, RULE_LABELS } from "@/types"

export function TypesTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [ruleFilter, setRuleFilter] = useState<string>("all")
  const [classFilter, setClassFilter] = useState<string>("all")
  const { data: documentClasses, loading, error } = useDocumentClasses()

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tipos de Documentos</CardTitle>
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
          <CardTitle>Tipos de Documentos</CardTitle>
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

  const allTypes = documentClasses.flatMap(docClass => 
    (docClass.documentTypes || docClass.types || []).map(docType => ({
      ...docType,
      className: docClass.name,
      classId: docClass.id
    }))
  )

  const filteredTypes = allTypes.filter(docType => {
    const matchesSearch = docType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         docType.className.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRule = ruleFilter === "all" || docType.rule === ruleFilter
    const matchesClass = classFilter === "all" || docType.classId === classFilter
    return matchesSearch && matchesRule && matchesClass
  })

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
        <CardTitle>Tipos de Documentos</CardTitle>
        <CardDescription>
          Gerencie as regras de anonimização para tipos específicos de documentos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar tipos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={ruleFilter} onValueChange={setRuleFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por regra" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as regras</SelectItem>
              <SelectItem value={AnonymizationRule.ALLOWED}>Permitidas</SelectItem>
              <SelectItem value={AnonymizationRule.RESTRICTED}>Restritas</SelectItem>
              <SelectItem value={AnonymizationRule.NOT_ALLOWED}>Bloqueadas</SelectItem>
            </SelectContent>
          </Select>
          <Select value={classFilter} onValueChange={setClassFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por classe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as classes</SelectItem>
              {documentClasses.map((docClass) => (
                <SelectItem key={docClass.id} value={docClass.id}>
                  {docClass.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome do Tipo</TableHead>
                <TableHead>Classe</TableHead>
                <TableHead>Regra</TableHead>
                <TableHead>Restrição</TableHead>
                <TableHead>Rótulos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTypes.map((docType, index) => (
                <TableRow key={`${docType.classId}-${docType.id}-${index}`}>
                  <TableCell className="font-medium">{docType.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{docType.className}</Badge>
                  </TableCell>
                  <TableCell>
                    {docType.rule ? (
                      <Badge variant={getRuleBadgeVariant(docType.rule)}>
                        {RULE_LABELS[docType.rule]}
                      </Badge>
                    ) : (
                      <Badge variant="outline">Não definida</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {(docType.restrictionDays || docType.days) ? `${docType.restrictionDays || docType.days} dias` : "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {(docType.labels || []).length}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredTypes.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum tipo encontrado com os filtros aplicados.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
