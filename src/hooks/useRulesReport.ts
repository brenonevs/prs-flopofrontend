/**
 * @fileoverview Custom Hook for Rules Report Management
 * 
 * Hook personalizado para gerenciar relatórios de regras de anonimização.
 * Inclui carregamento de dados, filtros e funcionalidades de refetch.
 * 
 * @author Sistema de Anonimização
 * @version 1.0.0
 */

"use client"

import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api'

/**
 * Interface para estrutura de relatório de regras.
 */
interface RulesReport {
  summary: {
    totalClasses: number
    totalTypes: number
    totalLabels: number
  }
  classes: any[]
  types: any[]
  labels: any[]
}

/**
 * Hook personalizado para gerenciar relatórios de regras.
 * 
 * Funcionalidades:
 * - Carregamento de dados de relatório com filtros
 * - Gerenciamento de estados de loading e erro
 * - Função de refetch com novos filtros
 * - Tratamento centralizado de erros de API
 * 
 * @param filters - Filtros opcionais para o relatório
 * @returns Objeto com dados, estados e função de refetch
 */
export function useRulesReport(filters?: any) {
  const [data, setData] = useState<RulesReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await apiClient.getRules(filters)
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar relatório')
        console.error('Erro ao buscar relatório de regras:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [filters])

  const refetch = async (newFilters?: any) => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiClient.getRules(newFilters || filters)
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao recarregar relatório')
    } finally {
      setLoading(false)
    }
  }

  return { data, loading, error, refetch }
}
