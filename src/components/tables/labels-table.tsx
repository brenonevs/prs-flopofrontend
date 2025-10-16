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

export function LabelsTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [ruleFilter, setRuleFilter] = useState<string>("all")
  const [classFilter, setClassFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const { data: documentClasses, loading, error } = useDocumentClasses()

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Rótulos de Documentos</CardTitle>
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
          <CardTitle>Rótulos de Documentos</CardTitle>
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

  const allLabels = documentClasses.flatMap(docClass => 
    (docClass.documentTypes || docClass.types || []).flatMap(docType => 
      (docType.labels || []).map(label => ({
        ...label,
        typeName: docType.name,
        typeId: label.typeId || docType.id,
        className: docClass.name,
        classId: docClass.id
      }))
    )
  )

  const filteredLabels = allLabels.filter(label => {
    const matchesSearch = label.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         label.typeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         label.className.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRule = ruleFilter === "all" || label.rule === ruleFilter
    const matchesClass = classFilter === "all" || label.classId === classFilter
    const matchesType = typeFilter === "all" || label.typeId === typeFilter
    return matchesSearch && matchesRule && matchesClass && matchesType
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

  const uniqueTypesMap = new Map()
  allLabels.forEach(label => {
    if (!uniqueTypesMap.has(label.typeId)) {
      uniqueTypesMap.set(label.typeId, { id: label.typeId, name: label.typeName })
    }
  })
  const uniqueTypes = Array.from(uniqueTypesMap.values())

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rótulos de Documentos</CardTitle>
        <CardDescription>
          Gerencie as regras de anonimização para campos específicos (rótulos) dos documentos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar rótulos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={ruleFilter} onValueChange={setRuleFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Regra" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value={AnonymizationRule.ALLOWED}>Permitidas</SelectItem>
              <SelectItem value={AnonymizationRule.RESTRICTED}>Restritas</SelectItem>
              <SelectItem value={AnonymizationRule.NOT_ALLOWED}>Bloqueadas</SelectItem>
            </SelectContent>
          </Select>
          <Select value={classFilter} onValueChange={setClassFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Classe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {documentClasses.map((docClass) => (
                <SelectItem key={docClass.id} value={docClass.id}>
                  {docClass.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {uniqueTypes.map((type, index) => (
                <SelectItem key={`type-${type.id}-${index}`} value={type.id}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome do Rótulo</TableHead>
                <TableHead>Classe</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Regra</TableHead>
                <TableHead>Restrição</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLabels.map((label, index) => (
                <TableRow key={`${label.classId}-${label.typeId}-${label.id}-${index}`}>
                  <TableCell className="font-medium">{label.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{label.className}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{label.typeName}</Badge>
                  </TableCell>
                  <TableCell>
                    {label.rule ? (
                      <Badge variant={getRuleBadgeVariant(label.rule)}>
                        {RULE_LABELS[label.rule]}
                      </Badge>
                    ) : (
                      <Badge variant="outline">Não definida</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {(label.restrictionDays || label.days) ? `${label.restrictionDays || label.days} dias` : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredLabels.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum rótulo encontrado com os filtros aplicados.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
