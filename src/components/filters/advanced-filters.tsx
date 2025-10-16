"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { IconSearch, IconFilter, IconX } from "@tabler/icons-react"
import { AnonymizationRule } from "@/types"

interface FilterState {
  search: string
  rule: string
  classId: string
  typeId: string
  dateFrom: string
  dateTo: string
}

interface AdvancedFiltersProps {
  onFiltersChange: (filters: FilterState) => void
  availableClasses?: Array<{ id: string; name: string }>
  availableTypes?: Array<{ id: string; name: string }>
  showDateFilters?: boolean
}

export function AdvancedFilters({ 
  onFiltersChange, 
  availableClasses = [], 
  availableTypes = [],
  showDateFilters = false 
}: AdvancedFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    rule: "all",
    classId: "all",
    typeId: "all",
    dateFrom: "",
    dateTo: ""
  })

  const [isExpanded, setIsExpanded] = useState(false)

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters = {
      search: "",
      rule: "all",
      classId: "all",
      typeId: "all",
      dateFrom: "",
      dateTo: ""
    }
    setFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  const activeFiltersCount = Object.values(filters).filter(value => 
    value && value !== "all" && value !== ""
  ).length

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IconFilter className="h-4 w-4" />
            <CardTitle className="text-sm">Filtros Avançados</CardTitle>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">{activeFiltersCount}</Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <IconX className="h-4 w-4" />
                Limpar
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Menos" : "Mais"}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filters.rule} onValueChange={(value) => handleFilterChange("rule", value)}>
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

        {isExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t">
            {availableClasses.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="class-filter">Classe</Label>
                <Select value={filters.classId} onValueChange={(value) => handleFilterChange("classId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar classe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as classes</SelectItem>
                    {availableClasses.map((cls, index) => (
                      <SelectItem key={`class-${cls.id}-${index}`} value={cls.id}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {availableTypes.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="type-filter">Tipo</Label>
                <Select value={filters.typeId} onValueChange={(value) => handleFilterChange("typeId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    {availableTypes.map((type, index) => (
                      <SelectItem key={`type-${type.id}-${index}`} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {showDateFilters && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="date-from">Data inicial</Label>
                  <Input
                    id="date-from"
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date-to">Data final</Label>
                  <Input
                    id="date-to"
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                  />
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
