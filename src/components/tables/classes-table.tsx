/**
 * @fileoverview Classes Table Component
 * 
 * Tabela para visualização e gerenciamento de classes de documentos.
 * Permite visualizar regras aplicadas, filtrar dados e navegar
 * para edição detalhada das configurações.
 * 
 * @author Sistema de Anonimização
 * @version 1.0.0
 */

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

/**
 * Tabela de classes de documentos com funcionalidades de filtro e busca.
 * 
 * Funcionalidades:
 * - Exibição de classes com regras aplicadas
 * - Filtros por regra de anonimização
 * - Busca por nome da classe
 * - Indicadores visuais de status das regras
 * - Navegação para edição detalhada
 * 
 * @returns JSX da tabela de classes de documentos
 */
export function ClassesTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [ruleFilter, setRuleFilter] = useState<string>("all")
  const { data: documentClasses, loading, error } = useDocumentClasses()

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Classes de Documentos</CardTitle>
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
          <CardTitle>Classes de Documentos</CardTitle>
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

  const filteredClasses = documentClasses.filter(docClass => {
    const matchesSearch = docClass.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRule = ruleFilter === "all" || docClass.rule === ruleFilter
    return matchesSearch && matchesRule
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
        <CardTitle>Classes de Documentos</CardTitle>
        <CardDescription>
          Gerencie as regras de anonimização para classes de documentos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar classes..."
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
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome da Classe</TableHead>
                <TableHead>Regra</TableHead>
                <TableHead>Restrição</TableHead>
                <TableHead>Tipos</TableHead>
                <TableHead>Rótulos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClasses.map((docClass) => (
                <TableRow key={docClass.id}>
                  <TableCell className="font-medium">{docClass.name}</TableCell>
                  <TableCell>
                    {docClass.rule ? (
                      <Badge variant={getRuleBadgeVariant(docClass.rule)}>
                        {RULE_LABELS[docClass.rule]}
                      </Badge>
                    ) : (
                      <Badge variant="outline">Não definida</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {(docClass.restrictionDays || docClass.days) ? `${docClass.restrictionDays || docClass.days} dias` : "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {(docClass.documentTypes || docClass.types || []).length}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {(docClass.documentTypes || docClass.types || []).reduce((sum, type) => sum + (type.labels?.length || 0), 0)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredClasses.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Nenhuma classe encontrada com os filtros aplicados.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
