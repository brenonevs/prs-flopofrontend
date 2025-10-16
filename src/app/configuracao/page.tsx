/**
 * @fileoverview Configuration Page Component
 * 
 * Página principal para configuração de regras de anonimização.
 * Permite visualizar e editar regras hierárquicas para classes, tipos
 * e rótulos de documentos com interface expansível e intuitiva.
 * 
 * @author Sistema de Anonimização
 * @version 1.0.0
 */

"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AnonymizationRule, DocumentClass, RULE_LABELS, RULE_COLORS } from "@/types";
import { apiClient } from "@/lib/api";

/**
 * Página de configuração de regras de anonimização.
 * 
 * Funcionalidades:
 * - Visualização hierárquica de classes, tipos e rótulos
 * - Edição inline de regras de anonimização
 * - Interface expansível para navegação na hierarquia
 * - Atualização em tempo real das configurações
 * - Validação de regras hierárquicas
 * 
 * @returns JSX da página de configuração com interface hierárquica
 */
export default function ConfiguracaoPage() {
  const [documentClasses, setDocumentClasses] = useState<DocumentClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedClass, setExpandedClass] = useState<string | null>(null);
  const [expandedType, setExpandedType] = useState<string | null>(null);

  /**
   * Efeito para carregar dados das classes de documentos na montagem.
   */
  useEffect(() => {
    loadDocumentClasses();
  }, []);

  /**
   * Função para carregar classes de documentos da API.
   * 
   * Gerencia estados de loading e erro durante a requisição.
   */
  const loadDocumentClasses = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getDocumentClasses();
      setDocumentClasses(data);
    } catch (error) {
      console.error('Erro ao carregar classes de documentos:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Atualiza regra de anonimização para uma classe de documento.
   * 
   * @param classId - ID da classe de documento
   * @param rule - Nova regra de anonimização
   * @param days - Dias de restrição (opcional)
   */
  const updateClassRule = async (classId: string, rule: AnonymizationRule, days?: number) => {
    try {
      await apiClient.updateDocumentClassRule(classId, { rule, days });
      await loadDocumentClasses(); 
    } catch (error) {
      console.error('Erro ao atualizar regra da classe:', error);
    }
  };

  /**
   * Atualiza regra de anonimização para um tipo de documento.
   * 
   * @param typeId - ID do tipo de documento
   * @param rule - Nova regra de anonimização
   * @param days - Dias de restrição (opcional)
   */
  const updateTypeRule = async (typeId: string, rule: AnonymizationRule, days?: number) => {
    try {
      await apiClient.updateDocumentTypeRule(typeId, { rule, days });
      await loadDocumentClasses(); 
    } catch (error) {
      console.error('Erro ao atualizar regra do tipo:', error);
    }
  };

  /**
   * Atualiza regra de anonimização para um rótulo.
   * 
   * @param labelId - ID do rótulo
   * @param rule - Nova regra de anonimização
   * @param days - Dias de restrição (opcional)
   */
  const updateLabelRule = async (labelId: string, rule: AnonymizationRule, days?: number) => {
    try {
      await apiClient.updateLabelRule(labelId, { rule, days });
      await loadDocumentClasses();
    } catch (error) {
      console.error('Erro ao atualizar regra do rótulo:', error);
    }
  };

  const getRuleBadge = (rule?: AnonymizationRule) => {
    if (!rule) return null;
    const colors = RULE_COLORS[rule];
    return (
      <Badge className={colors.badge}>
        {RULE_LABELS[rule]}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Configuração de Regras</h2>
          <p className="text-muted-foreground">
            Configure as regras de anonimização para classes, tipos e rótulos de documentos
          </p>
        </div>
        <Button onClick={loadDocumentClasses} variant="outline">
          Atualizar
        </Button>
      </div>

      <div className="space-y-4">
        {documentClasses.map((docClass) => (
          <Card key={docClass.id} className="overflow-hidden">
            <CardHeader 
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => setExpandedClass(expandedClass === docClass.id ? null : docClass.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-lg">{docClass.name}</CardTitle>
                  {getRuleBadge(docClass.rule)}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {docClass.documentTypes?.length || 0} tipos
                  </span>
                  <span className="text-sm">
                    {expandedClass === docClass.id ? '▼' : '▶'}
                  </span>
                </div>
              </div>
            </CardHeader>
            
            {expandedClass === docClass.id && (
              <CardContent className="border-t">
                <div className="space-y-6">
                  {/* Rule configuration for the class */}
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-medium mb-3">Regra da Classe</h4>
                    <RuleSelector
                      currentRule={docClass.rule}
                      currentDays={docClass.days}
                      onRuleChange={(rule, days) => updateClassRule(docClass.id, rule, days)}
                    />
                  </div>

                  {/* Document types */}
                  <div className="space-y-3">
                    <h4 className="font-medium">Tipos de Documento</h4>
                    {docClass.documentTypes?.map((docType) => (
                      <Card key={docType.id} className="ml-4">
                        <CardHeader 
                          className="cursor-pointer py-3"
                          onClick={() => setExpandedType(expandedType === docType.id ? null : docType.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="font-medium">{docType.name}</span>
                              {getRuleBadge(docType.rule)}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">
                                {docType.labels?.length || 0} rótulos
                              </span>
                              <span className="text-sm">
                                {expandedType === docType.id ? '▼' : '▶'}
                              </span>
                            </div>
                          </div>
                        </CardHeader>
                        
                        {expandedType === docType.id && (
                          <CardContent className="border-t">
                            <div className="space-y-4">
                              {/* Rule configuration for the type */}
                              <div className="bg-muted/30 p-3 rounded-lg">
                                <h5 className="font-medium mb-2 text-sm">Regra do Tipo</h5>
                                <RuleSelector
                                  currentRule={docType.rule}
                                  currentDays={docType.days}
                                  onRuleChange={(rule, days) => updateTypeRule(docType.id, rule, days)}
                                  disabled={docClass.rule === AnonymizationRule.NOT_ALLOWED}
                                />
                              </div>

                              {/* Labels */}
                              <div className="space-y-2">
                                <h5 className="font-medium text-sm">Rótulos</h5>
                                <div className="grid gap-2">
                                  {docType.labels?.map((label) => (
                                    <div key={label.id} className="flex items-center justify-between p-2 bg-muted/20 rounded">
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm">{label.name}</span>
                                        {getRuleBadge(label.rule)}
                                      </div>
                                      <div className="w-64">
                                        <RuleSelector
                                          currentRule={label.rule}
                                          currentDays={label.days}
                                          onRuleChange={(rule, days) => updateLabelRule(label.id, rule, days)}
                                          disabled={
                                            docClass.rule === AnonymizationRule.NOT_ALLOWED ||
                                            docType.rule === AnonymizationRule.NOT_ALLOWED
                                          }
                                          compact
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

/**
 * Interface para propriedades do seletor de regras.
 */
interface RuleSelectorProps {
  currentRule?: AnonymizationRule;
  currentDays?: number;
  onRuleChange: (rule: AnonymizationRule, days?: number) => void;
  disabled?: boolean;
  compact?: boolean;
}

/**
 * Componente seletor de regras de anonimização.
 * 
 * Permite selecionar tipo de regra e configurar dias de restrição
 * quando aplicável. Suporta modo compacto para uso em tabelas.
 * 
 * @param props - Propriedades do seletor de regras
 * @returns JSX do seletor de regras
 */
function RuleSelector({ currentRule, currentDays, onRuleChange, disabled, compact }: RuleSelectorProps) {
  const [selectedRule, setSelectedRule] = useState<AnonymizationRule | undefined>(currentRule);
  const [days, setDays] = useState<string>(currentDays?.toString() || '');

  const handleRuleChange = (rule: AnonymizationRule) => {
    setSelectedRule(rule);
    if (rule === AnonymizationRule.RESTRICTED) {
      onRuleChange(rule, parseInt(days) || undefined);
    } else {
      onRuleChange(rule);
    }
  };

  const handleDaysChange = (newDays: string) => {
    setDays(newDays);
    if (selectedRule === AnonymizationRule.RESTRICTED) {
      onRuleChange(selectedRule, parseInt(newDays) || undefined);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${compact ? 'flex-row' : 'flex-col sm:flex-row'}`}>
      <Select
        value={selectedRule}
        onValueChange={handleRuleChange}
        disabled={disabled}
      >
        <SelectTrigger className={compact ? 'w-40' : 'w-full sm:w-48'}>
          <SelectValue placeholder="Selecione uma regra" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={AnonymizationRule.ALLOWED}>🟩 Permitido</SelectItem>
          <SelectItem value={AnonymizationRule.RESTRICTED}>🟨 Restrito</SelectItem>
          <SelectItem value={AnonymizationRule.NOT_ALLOWED}>🟥 Não Permitido</SelectItem>
        </SelectContent>
      </Select>
      
      {selectedRule === AnonymizationRule.RESTRICTED && (
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Dias"
            value={days}
            onChange={(e) => handleDaysChange(e.target.value)}
            className={compact ? 'w-20' : 'w-24'}
            min="1"
            disabled={disabled}
          />
          {!compact && <Label className="text-sm text-muted-foreground">dias</Label>}
        </div>
      )}
    </div>
  );
}