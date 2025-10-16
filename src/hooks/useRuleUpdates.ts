"use client"

import { useState } from 'react'
import { apiClient } from '@/lib/api'
import { AnonymizationRule } from '@/types'

interface UpdateRuleParams {
  id: string
  rule: AnonymizationRule
  days?: number
}

export function useRuleUpdates() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateDocumentClassRule = async ({ id, rule, days }: UpdateRuleParams) => {
    try {
      setLoading(true)
      setError(null)
      await apiClient.updateDocumentClassRule(id, { rule, days })
      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar regra da classe'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const updateDocumentTypeRule = async ({ id, rule, days }: UpdateRuleParams) => {
    try {
      setLoading(true)
      setError(null)
      await apiClient.updateDocumentTypeRule(id, { rule, days })
      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar regra do tipo'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const updateLabelRule = async ({ id, rule, days }: UpdateRuleParams) => {
    try {
      setLoading(true)
      setError(null)
      await apiClient.updateLabelRule(id, { rule, days })
      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar regra do rótulo'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  return {
    updateDocumentClassRule,
    updateDocumentTypeRule,
    updateLabelRule,
    loading,
    error
  }
}
