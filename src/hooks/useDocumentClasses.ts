/**
 * @fileoverview Custom Hook for Document Classes Management
 * 
 * Hook personalizado para gerenciar o estado das classes de documentos,
 * incluindo carregamento, tratamento de erros e refetch de dados.
 * 
 * @author Sistema de Anonimização
 * @version 1.0.0
 */

"use client"

import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api'
import { DocumentClass } from '@/types'

/**
 * Hook personalizado para gerenciar classes de documentos.
 * 
 * Funcionalidades:
 * - Carregamento automático de dados na montagem do componente
 * - Gerenciamento de estados de loading e erro
 * - Função de refetch para recarregar dados
 * - Tratamento centralizado de erros de API
 * 
 * @returns Objeto com dados, estados e função de refetch
 */
export function useDocumentClasses() {
  const [data, setData] = useState<DocumentClass[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /**
   * Efeito para carregar dados automaticamente na montagem do componente.
   * 
   * Executa a requisição inicial e gerencia os estados de loading e erro.
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await apiClient.getDocumentClasses()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar dados')
        console.error('Erro ao buscar classes de documentos:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  /**
   * Função para recarregar dados manualmente.
   * 
   * Útil para atualizar dados após operações de modificação
   * ou quando o usuário solicita refresh.
   * 
   * @returns Promise que resolve quando os dados são recarregados
   */
  const refetch = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiClient.getDocumentClasses()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao recarregar dados')
    } finally {
      setLoading(false)
    }
  }

  return { data, loading, error, refetch }
}
