/**
 * @fileoverview Edit Rules Page Component
 * 
 * Página avançada para edição em lote de regras de anonimização.
 * Permite editar múltiplas regras simultaneamente com interface hierárquica
 * expansível e salvamento em lote com tratamento de erros.
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
import { IconChevronDown, IconChevronRight, IconEdit, IconDeviceFloppy, IconArrowLeft, IconAlertCircle } from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import { useDocumentClasses } from "@/hooks/useDocumentClasses"
import { AnonymizationRule, RULE_LABELS, DocumentClass, DocumentType, Label } from "@/types"
import { apiClient } from "@/lib/api"
import { toast } from "sonner"

/**
 * Interface para regra editável com configurações temporárias.
 */
interface EditableRule {
  rule: AnonymizationRule
  restrictionDays?: number
}

/**
 * Página de edição avançada de regras de anonimização.
 * 
 * Funcionalidades:
 * - Interface hierárquica expansível (classes → tipos → rótulos)
 * - Edição em lote de múltiplas regras
 * - Validação de regras hierárquicas
 * - Salvamento com tratamento de erros individuais
 * - Feedback visual de alterações pendentes
 * - Navegação intuitiva na hierarquia
 * 
 * @returns JSX da página de edição de regras
 */
export default function EditarRegrasPage() {
  const router = useRouter()
  const { data: documentClasses, loading, error, refetch } = useDocumentClasses()
  const [expandedClasses, setExpandedClasses] = useState<Set<string>>(new Set())
  const [expandedTypes, setExpandedTypes] = useState<Set<string>>(new Set())
  const [editingRules, setEditingRules] = useState<Map<string, EditableRule>>(new Map())
  const [restrictionDaysInput, setRestrictionDaysInput] = useState<Map<string, string>>(new Map())
  const [itemErrors, setItemErrors] = useState<Map<string, string>>(new Map())

  const toggleClass = (classId: string) => {
    const newExpanded = new Set(expandedClasses)
    if (newExpanded.has(classId)) {
      newExpanded.delete(classId)
    } else {
      newExpanded.add(classId)
    }
    setExpandedClasses(newExpanded)
  }

  const toggleType = (typeId: string) => {
    const newExpanded = new Set(expandedTypes)
    if (newExpanded.has(typeId)) {
      newExpanded.delete(typeId)
    } else {
      newExpanded.add(typeId)
    }
    setExpandedTypes(newExpanded)
  }

  const updateRule = (id: string, rule: AnonymizationRule) => {
    const newRules = new Map(editingRules)
    const ruleData: EditableRule = { rule }
    
    if (rule === AnonymizationRule.RESTRICTED) {
      const inputValue = restrictionDaysInput.get(id)
      const currentDays = getCurrentDays(id, getOriginalDays(id))
      ruleData.restrictionDays = inputValue ? parseInt(inputValue) : (currentDays || 30)
    }
    
    newRules.set(id, ruleData)
    setEditingRules(newRules)
    
    if (itemErrors.has(id)) {
      const newErrors = new Map(itemErrors)
      newErrors.delete(id)
      setItemErrors(newErrors)
    }
  }

  const updateRestrictionDays = (id: string, days: string) => {
    const newDaysInput = new Map(restrictionDaysInput)
    newDaysInput.set(id, days)
    setRestrictionDaysInput(newDaysInput)
    
    const daysNumber = parseInt(days)
    if (!isNaN(daysNumber) && daysNumber > 0) {
      const newRules = new Map(editingRules)
      
      const originalRule = getOriginalRule(id)
      const originalDays = getOriginalDays(id)
      
      const currentRule = editingRules.get(id)
      const effectiveRule = currentRule?.rule || originalRule
      
      const daysChanged = originalDays !== daysNumber
      
      if (effectiveRule === AnonymizationRule.RESTRICTED) {
        if (daysChanged) {
          if (currentRule) {
            newRules.set(id, { ...currentRule, restrictionDays: daysNumber })
          } else {
            newRules.set(id, { rule: AnonymizationRule.RESTRICTED, restrictionDays: daysNumber })
          }
        } else {
          if (currentRule && currentRule.rule === originalRule) {
            newRules.delete(id)
          }
        }
        
        setEditingRules(newRules)
      }
      
      if (itemErrors.has(id)) {
        const newErrors = new Map(itemErrors)
        newErrors.delete(id)
        setItemErrors(newErrors)
      }
    }
  }

  const getOriginalDays = (id: string): number | undefined => {
    for (const docClass of documentClasses) {
      if (docClass.id === id) {
        return docClass.restrictionDays || docClass.days
      }
      for (const docType of (docClass.documentTypes || docClass.types || [])) {
        if (docType.id === id) {
          return docType.restrictionDays || docType.days
        }
        for (const label of (docType.labels || [])) {
          if (label.id === id) {
            return label.restrictionDays
          }
        }
      }
    }
    return undefined
  }

  const getOriginalRule = (id: string): AnonymizationRule | undefined => {
    for (const docClass of documentClasses) {
      if (docClass.id === id) {
        return docClass.rule
      }
      for (const docType of (docClass.documentTypes || docClass.types || [])) {
        if (docType.id === id) {
          return docType.rule
        }
        for (const label of (docType.labels || [])) {
          if (label.id === id) {
            return label.rule
          }
        }
      }
    }
    return undefined
  }

  const saveRules = async () => {
    try {
      const promises = []
      const ruleDetails = []
      
      for (const [id, rule] of editingRules.entries()) {
        let ruleType = 'label'
        let itemName = 'Item'
        
        const docClass = documentClasses.find(dc => dc.id === id)
        if (docClass) {
          promises.push(apiClient.updateDocumentClassRule(id, rule))
          ruleDetails.push({ id, type: 'classe', name: docClass.name })
          continue
        }
        
        const docType = documentClasses
          .flatMap(dc => dc.documentTypes || dc.types || [])
          .find(dt => dt.id === id)
        if (docType) {
          promises.push(apiClient.updateDocumentTypeRule(id, rule))
          ruleDetails.push({ id, type: 'tipo', name: docType.name })
          continue
        }
        
        let labelName = 'Label'
        for (const dc of documentClasses) {
          for (const dt of (dc.documentTypes || dc.types || [])) {
            const label = (dt.labels || []).find(l => l.id === id)
            if (label) {
              labelName = label.name
              break
            }
          }
        }
        
        promises.push(apiClient.updateLabelRule(id, rule))
        ruleDetails.push({ id, type: 'rótulo', name: labelName })
      }
      
      const results = await Promise.allSettled(promises)
      
      let successCount = 0
      let hasErrors = false
      const newItemErrors = new Map()
      
      for (let i = 0; i < results.length; i++) {
        const result = results[i]
        const detail = ruleDetails[i]
        
        if (result.status === 'fulfilled') {
          successCount++
          newItemErrors.delete(detail.id)
        } else {
          hasErrors = true
          let errorMessage = 'Erro desconhecido'
          
          if (result.reason?.message) {
            errorMessage = result.reason.message
          } else if (typeof result.reason === 'string') {
            errorMessage = result.reason
          }
          
          newItemErrors.set(detail.id, errorMessage)
          
          toast.error(`Erro ao atualizar ${detail.type} "${detail.name}": ${errorMessage}`, {
            duration: 6000
          })
        }
      }
      
      setItemErrors(newItemErrors)
      
      if (successCount > 0) {
        toast.success(`${successCount} regra(s) salva(s) com sucesso!`)
        
        await refetch()
        
        if (!hasErrors) {
          setEditingRules(new Map())
          setRestrictionDaysInput(new Map())
          setItemErrors(new Map())
        } else {
          const newEditingRules = new Map()
          const newRestrictionDaysInput = new Map()
          
          for (let i = 0; i < results.length; i++) {
            if (results[i].status === 'rejected') {
              const detail = ruleDetails[i]
              const originalRule = editingRules.get(detail.id)
              if (originalRule) {
                newEditingRules.set(detail.id, originalRule)
              }
              const originalDays = restrictionDaysInput.get(detail.id)
              if (originalDays) {
                newRestrictionDaysInput.set(detail.id, originalDays)
              }
            }
          }
          
          setEditingRules(newEditingRules)
          setRestrictionDaysInput(newRestrictionDaysInput)
        }
      } else if (hasErrors) {
        toast.error("Nenhuma regra foi salva devido a erros de validação")
      }
      
    } catch (error) {
      console.error('Erro geral ao salvar regras:', error)
      
      let errorMessage = 'Erro inesperado ao salvar regras'
      
      if (error && typeof error === 'object' && 'message' in error) {
        if (error.message) {
          try {
            const errorData = JSON.parse(error.message as string)
            errorMessage = errorData.message || error.message
          } catch {
            errorMessage = error.message as string
          }
        }
      }
      
      toast.error(errorMessage)
    }
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

  const getCurrentRule = (id: string, originalRule?: AnonymizationRule): AnonymizationRule | undefined => {
    return editingRules.get(id)?.rule || originalRule
  }

  const getCurrentDays = (id: string, originalDays?: number): number | undefined => {
    return editingRules.get(id)?.restrictionDays || originalDays
  }

  const renderErrorAlert = (id: string) => {
    const error = itemErrors.get(id)
    if (!error) return null

    return (
      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md flex items-start space-x-2">
        <IconAlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-red-700">
          <p className="font-medium">Erro de validação:</p>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8 text-red-600">
              Erro: {error}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center space-x-2"
          >
            <IconArrowLeft className="h-4 w-4" />
            <span>Voltar</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Editar Regras de Anonimização</h1>
            <p className="text-muted-foreground">
              Gerencie as regras para classes, tipos e rótulos de documentos
            </p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hierarquia de Documentos</CardTitle>
          <CardDescription>
            Clique nos itens para expandir e editar suas regras de anonimização
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {documentClasses.map((docClass) => (
              <div key={docClass.id} className="border rounded-lg">
                <div>
                  <div className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                    <button
                      className="flex items-center space-x-3 flex-1 min-w-0"
                      onClick={() => toggleClass(docClass.id)}
                    >
                      {expandedClasses.has(docClass.id) ? (
                        <IconChevronDown className="h-4 w-4 flex-shrink-0" />
                      ) : (
                        <IconChevronRight className="h-4 w-4 flex-shrink-0" />
                      )}
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <span className="font-medium text-lg truncate">{docClass.name}</span>
                        <Badge variant="outline" className="flex-shrink-0">
                          Classe ({(docClass.documentTypes || docClass.types || []).length} tipos)
                        </Badge>
                        {getCurrentRule(docClass.id, docClass.rule) && (
                          <Badge variant={getRuleBadgeVariant(getCurrentRule(docClass.id, docClass.rule)!)} className="overflow-visible whitespace-nowrap flex-shrink-0 px-3 py-1 text-xs min-w-max">
                            {RULE_LABELS[getCurrentRule(docClass.id, docClass.rule)!]}
                          </Badge>
                        )}
                      </div>
                    </button>
                    <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
                      <Select
                        value={getCurrentRule(docClass.id, docClass.rule) || ""}
                        onValueChange={(value) => updateRule(docClass.id, value as AnonymizationRule)}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Selecionar regra" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={AnonymizationRule.ALLOWED}>
                            {RULE_LABELS[AnonymizationRule.ALLOWED]}
                          </SelectItem>
                          <SelectItem value={AnonymizationRule.RESTRICTED}>
                            {RULE_LABELS[AnonymizationRule.RESTRICTED]}
                          </SelectItem>
                          <SelectItem value={AnonymizationRule.NOT_ALLOWED}>
                            {RULE_LABELS[AnonymizationRule.NOT_ALLOWED]}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {getCurrentRule(docClass.id, docClass.rule) === AnonymizationRule.RESTRICTED && (
                        <div className="flex items-center space-x-1">
                          <Input
                            type="number"
                            min="1"
                            placeholder="30"
                            value={restrictionDaysInput.get(docClass.id) || getCurrentDays(docClass.id, getOriginalDays(docClass.id)) || "30"}
                            onChange={(e) => updateRestrictionDays(docClass.id, e.target.value)}
                            className="w-16 h-8 text-xs"
                          />
                          <span className="text-xs text-muted-foreground">dias</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {renderErrorAlert(docClass.id)}
                  {expandedClasses.has(docClass.id) && (
                    <div className="pl-8 pr-4 pb-4 space-y-3">
                      {(docClass.documentTypes || docClass.types || []).map((docType) => (
                        <div key={docType.id} className="border-l-2 border-muted pl-4">
                          <div>
                            <div className="w-full flex items-center justify-between py-2 hover:bg-muted/30 rounded transition-colors">
                              <button
                                className="flex items-center space-x-3 flex-1 min-w-0"
                                onClick={() => toggleType(docType.id)}
                              >
                                {expandedTypes.has(docType.id) ? (
                                  <IconChevronDown className="h-3 w-3 flex-shrink-0" />
                                ) : (
                                  <IconChevronRight className="h-3 w-3 flex-shrink-0" />
                                )}
                                <div className="flex items-center space-x-2 min-w-0 flex-1">
                                  <span className="font-medium truncate">{docType.name}</span>
                                  <Badge variant="outline" className="text-xs flex-shrink-0">
                                    Tipo ({docType.labels?.length || 0} rótulos)
                                  </Badge>
                                  {getCurrentRule(docType.id, docType.rule) && (
                                    <Badge variant={getRuleBadgeVariant(getCurrentRule(docType.id, docType.rule)!)} className="text-xs overflow-visible whitespace-nowrap flex-shrink-0 px-2 py-1 min-w-max">
                                      {RULE_LABELS[getCurrentRule(docType.id, docType.rule)!]}
                                    </Badge>
                                  )}
                                </div>
                              </button>
                              <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
                                <Select
                                  value={getCurrentRule(docType.id, docType.rule) || ""}
                                  onValueChange={(value) => updateRule(docType.id, value as AnonymizationRule)}
                                >
                                  <SelectTrigger className="w-36">
                                    <SelectValue placeholder="Regra" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value={AnonymizationRule.ALLOWED}>
                                      {RULE_LABELS[AnonymizationRule.ALLOWED]}
                                    </SelectItem>
                                    <SelectItem value={AnonymizationRule.RESTRICTED}>
                                      {RULE_LABELS[AnonymizationRule.RESTRICTED]}
                                    </SelectItem>
                                    <SelectItem value={AnonymizationRule.NOT_ALLOWED}>
                                      {RULE_LABELS[AnonymizationRule.NOT_ALLOWED]}
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                {getCurrentRule(docType.id, docType.rule) === AnonymizationRule.RESTRICTED && (
                                  <div className="flex items-center space-x-1">
                                    <Input
                                      type="number"
                                      min="1"
                                      placeholder="30"
                                      value={restrictionDaysInput.get(docType.id) || getCurrentDays(docType.id, getOriginalDays(docType.id)) || "30"}
                                      onChange={(e) => updateRestrictionDays(docType.id, e.target.value)}
                                      className="w-16 h-8 text-xs"
                                    />
                                    <span className="text-xs text-muted-foreground">dias</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            {renderErrorAlert(docType.id)}
                            {expandedTypes.has(docType.id) && (
                              <div className="pl-6 space-y-2 mt-2">
                                {(docType.labels || []).map((label) => (
                                  <div
                                    key={label.id}
                                    className="flex items-center justify-between p-2 border rounded hover:bg-muted/20 transition-colors"
                                  >
                                    <div className="flex items-center space-x-2 flex-1 min-w-0 mr-4">
                                      <span className="text-sm flex-shrink-0 truncate">{label.name}</span>
                                      <Badge variant="outline" className="text-xs flex-shrink-0">
                                        Rótulo
                                      </Badge>
                                      {getCurrentRule(label.id, label.rule) && (
                                        <Badge variant={getRuleBadgeVariant(getCurrentRule(label.id, label.rule)!)} className="text-xs overflow-visible whitespace-nowrap flex-shrink-0 px-2 py-1 min-w-max">
                                          {RULE_LABELS[getCurrentRule(label.id, label.rule)!]}
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                                      <Select
                                        value={getCurrentRule(label.id, label.rule) || ""}
                                        onValueChange={(value) => updateRule(label.id, value as AnonymizationRule)}
                                      >
                                        <SelectTrigger className="w-32">
                                          <SelectValue placeholder="Regra" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value={AnonymizationRule.ALLOWED}>
                                            {RULE_LABELS[AnonymizationRule.ALLOWED]}
                                          </SelectItem>
                                          <SelectItem value={AnonymizationRule.RESTRICTED}>
                                            {RULE_LABELS[AnonymizationRule.RESTRICTED]}
                                          </SelectItem>
                                          <SelectItem value={AnonymizationRule.NOT_ALLOWED}>
                                            {RULE_LABELS[AnonymizationRule.NOT_ALLOWED]}
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                      {getCurrentRule(label.id, label.rule) === AnonymizationRule.RESTRICTED && (
                                        <div className="flex items-center space-x-1">
                                          <Input
                                            type="number"
                                            min="1"
                                            placeholder="30"
                                            value={restrictionDaysInput.get(label.id) || getCurrentDays(label.id, getOriginalDays(label.id)) || "30"}
                                            onChange={(e) => updateRestrictionDays(label.id, e.target.value)}
                                            className="w-16 h-8 text-xs"
                                          />
                                          <span className="text-xs text-muted-foreground">dias</span>
                                        </div>
                                      )}
                                    </div>
                                    {renderErrorAlert(label.id)}
                                  </div>
                                ))}
                                {(!docType.labels || docType.labels.length === 0) && (
                                  <div className="text-sm text-muted-foreground italic">
                                    Nenhum rótulo encontrado
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      {(!(docClass.documentTypes || docClass.types) || (docClass.documentTypes || docClass.types || []).length === 0) && (
                        <div className="text-sm text-muted-foreground italic pl-4">
                          Nenhum tipo encontrado
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Fixed Save Button */}
      {editingRules.size > 0 && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button 
            onClick={saveRules} 
            size="lg"
            className="flex items-center space-x-2 shadow-lg hover:shadow-xl transition-shadow bg-primary hover:bg-primary/90"
          >
            <IconDeviceFloppy className="h-5 w-5" />
            <span>Salvar Alterações ({editingRules.size})</span>
          </Button>
        </div>
      )}
    </div>
  )
}