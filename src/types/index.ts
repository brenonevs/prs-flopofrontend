/**
 * @fileoverview Type Definitions for Anonymization System
 * 
 * Define todas as interfaces, enums e tipos TypeScript utilizados no sistema
 * de anonimização. Estes tipos garantem type safety e documentam a estrutura
 * de dados da aplicação.
 * 
 * @author Sistema de Anonimização
 * @version 1.0.0
 */

/**
 * Enum que define as regras de anonimização disponíveis no sistema.
 * 
 * As regras seguem uma hierarquia de permissões:
 * - NOT_ALLOWED: Documento não pode ser anonimizado
 * - RESTRICTED: Anonimização permitida com restrições temporais
 * - ALLOWED: Anonimização livre sem restrições
 */
export enum AnonymizationRule {
  NOT_ALLOWED = 'NOT_ALLOWED',
  RESTRICTED = 'RESTRICTED',
  ALLOWED = 'ALLOWED'
}

/**
 * Interface que representa uma classe de documento no sistema hierárquico.
 * 
 * As classes são o nível mais alto da hierarquia e podem conter múltiplos
 * tipos de documentos. Cada classe pode ter regras de anonimização específicas
 * que se aplicam a todos os seus tipos filhos.
 */
export interface DocumentClass {
  id: string;
  name: string;
  rule?: AnonymizationRule;
  restrictionDays?: number;
  days?: number; 
  documentTypes?: DocumentType[];
  types?: DocumentType[];
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Interface que representa um tipo de documento na hierarquia.
 * 
 * Os tipos são o nível intermediário da hierarquia, pertencendo a uma classe
 * e podendo conter múltiplos rótulos. Herdam regras da classe pai mas podem
 * ter regras específicas que sobrescrevem as da classe.
 */
export interface DocumentType {
  id: string;
  name: string;
  rule?: AnonymizationRule;
  restrictionDays?: number;
  days?: number; 
  documentClassId?: string;
  documentClass?: DocumentClass;
  labels?: Label[];
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Interface que representa um rótulo de documento na hierarquia.
 * 
 * Os rótulos são o nível mais específico da hierarquia, pertencendo a um tipo
 * de documento. Representam categorias finas de classificação e podem ter
 * regras de anonimização muito específicas.
 */
export interface Label {
  id: string;
  name: string;
  rule?: AnonymizationRule;
  restrictionDays?: number;
  typeId: string;
  documentTypeId?: string; 
  documentType?: DocumentType;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Interface para configuração de regras de anonimização.
 * 
 * Utilizada para definir regras específicas com parâmetros opcionais
 * como período de restrição em dias.
 */
export interface RuleConfiguration {
  rule: AnonymizationRule;
  days?: number;
}

/**
 * Interface para relatórios de regras aplicadas.
 * 
 * Representa uma entrada de relatório mostrando qual regra está
 * aplicada em cada nível da hierarquia (classe, tipo ou rótulo).
 */
export interface RuleReport {
  documentClassName: string;
  documentTypeName?: string;
  labelName?: string;
  rule: AnonymizationRule;
  days?: number;
  level: 'class' | 'type' | 'label';
}

/**
 * Interface para filtros de relatórios.
 * 
 * Permite filtrar relatórios por regra específica, termo de busca
 * ou classe de documento.
 */
export interface ReportFilters {
  rule?: AnonymizationRule;
  search?: string;
  documentClass?: string;
}

export const RULE_COLORS = {
  [AnonymizationRule.NOT_ALLOWED]: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    badge: 'bg-red-100 text-red-800'
  },
  [AnonymizationRule.RESTRICTED]: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    border: 'border-yellow-200',
    badge: 'bg-yellow-100 text-yellow-800'
  },
  [AnonymizationRule.ALLOWED]: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
    badge: 'bg-green-100 text-green-800'
  }
};

export const RULE_LABELS = {
  [AnonymizationRule.NOT_ALLOWED]: '🟥 Não Permitido',
  [AnonymizationRule.RESTRICTED]: '🟨 Restrito',
  [AnonymizationRule.ALLOWED]: '🟩 Permitido'
};