/**
 * @fileoverview API Client for Backend Integration
 * 
 * Cliente HTTP centralizado para comunicação com o backend do sistema de anonimização.
 * Gerencia requisições, tratamento de erros, fallback para dados mockados e
 * configurações de ambiente.
 * 
 * @author Sistema de Anonimização
 * @version 1.0.0
 */

import { mockDocumentClasses, generateMockReports } from './mock-data';

/**
 * URL base da API obtida das variáveis de ambiente.
 * Fallback para localhost:3001 em desenvolvimento.
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Flag para usar dados mockados ao invés da API real.
 * Útil para desenvolvimento offline ou demonstrações.
 */
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' || false;

/**
 * Cliente HTTP para integração com o backend.
 * 
 * Responsabilidades:
 * - Gerenciar requisições HTTP centralizadas
 * - Tratar erros de rede e API
 * - Implementar fallback para dados mockados
 * - Configurar headers e autenticação
 */
class ApiClient {
  private baseUrl: string;

  /**
   * Inicializa o cliente com URL base da API.
   * 
   * @param baseUrl - URL base da API (padrão: variável de ambiente)
   */
  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Método privado para realizar requisições HTTP com tratamento de erros.
   * 
   * Implementa fallback automático para dados mockados quando:
   * - Modo mock está habilitado via variável de ambiente
   * - Backend não está disponível (erro de rede)
   * 
   * @param endpoint - Endpoint da API a ser chamado
   * @param options - Opções de configuração da requisição
   * @returns Promise com dados da resposta ou dados mockados
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return this.getMockData(endpoint) as T;
    }

    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch {
        }
        
        const error = new Error(errorMessage);
        error.status = response.status;
        throw error;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error.status) {
        throw error;
      }
        
      console.warn(`Backend não disponível (${this.baseUrl}). Usando dados de demonstração.`);
      await new Promise(resolve => setTimeout(resolve, 300));
      return this.getMockData(endpoint) as T;
    }
  }

  /**
   * Método privado para obter dados mockados baseado no endpoint.
   * 
   * Mapeia endpoints da API para dados de demonstração correspondentes,
   * simulando respostas reais do backend para desenvolvimento offline.
   * 
   * @param endpoint - Endpoint da API para mapear dados mockados
   * @returns Dados mockados correspondentes ao endpoint
   */
  private getMockData(endpoint: string) {
    console.log('Using mock data for endpoint:', endpoint);
    
    if (endpoint === '/document-classes') {
      return mockDocumentClasses;
    }
    
    if (endpoint === '/rules/report') {
      return generateMockReports();
    }
    
    if (endpoint.startsWith('/rules/class/')) {
      return { success: true };
    }
    
    if (endpoint.startsWith('/rules/type/')) {
      return { success: true };
    }
    
    if (endpoint.startsWith('/rules/label/')) {
      return { success: true };
    }
    
    return [];
  }

  /**
   * Obtém todas as classes de documentos com suas hierarquias completas.
   * 
   * @returns Promise com array de classes de documentos
   */
  async getDocumentClasses() {
    return this.request('/document-classes');
  }

  /**
   * Obtém uma classe de documento específica por ID.
   * 
   * @param id - ID da classe de documento
   * @returns Promise com dados da classe de documento
   */
  async getDocumentClassById(id: string) {
    return this.request(`/document-classes/${id}`);
  }

  /**
   * Atualiza a regra de anonimização de uma classe de documento.
   * 
   * @param id - ID da classe de documento
   * @param rule - Configuração da regra (tipo e dias de restrição)
   * @returns Promise com resultado da operação
   */
  async updateDocumentClassRule(id: string, rule: any) {
    return this.request(`/rules/class/${id}`, {
      method: 'PUT',
      body: JSON.stringify(rule),
    });
  }

  /**
   * Atualiza a regra de anonimização de um tipo de documento.
   * 
   * @param id - ID do tipo de documento
   * @param rule - Configuração da regra (tipo e dias de restrição)
   * @returns Promise com resultado da operação
   */
  async updateDocumentTypeRule(id: string, rule: any) {
    return this.request(`/rules/type/${id}`, {
      method: 'PUT',
      body: JSON.stringify(rule),
    });
  }

  /**
   * Atualiza a regra de anonimização de um rótulo.
   * 
   * @param id - ID do rótulo
   * @param rule - Configuração da regra (tipo e dias de restrição)
   * @returns Promise com resultado da operação
   */
  async updateLabelRule(id: string, rule: any) {
    return this.request(`/rules/label/${id}`, {
      method: 'PUT',
      body: JSON.stringify(rule),
    });
  }

  /**
   * Obtém relatório de regras aplicadas com filtros opcionais.
   * 
   * @param filters - Filtros para o relatório (regra, busca, classe)
   * @returns Promise com dados do relatório
   */
  async getRules(filters?: any) {
    const queryString = filters 
      ? '?' + new URLSearchParams(filters).toString()
      : '';
    return this.request(`/rules/report${queryString}`);
  }
}

/**
 * Instância singleton do cliente API para uso em toda a aplicação.
 * 
 * Esta instância é configurada automaticamente com as variáveis de ambiente
 * e pode ser importada diretamente pelos componentes.
 */
export const apiClient = new ApiClient();