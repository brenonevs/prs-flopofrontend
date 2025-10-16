/**
 * @fileoverview Backend Status Component
 * 
 * Componente que monitora e exibe o status de conectividade com o backend.
 * Implementa verificação de saúde da API e exibe alertas informativos
 * quando o backend não está disponível.
 * 
 * @author Sistema de Anonimização
 * @version 1.0.0
 */

'use client';

import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";

/**
 * Componente de status do backend que monitora conectividade.
 * 
 * Funcionalidades:
 * - Verificação de conectividade com o backend
 * - Exibição de alerta quando backend não está disponível
 * - Instruções para iniciar o backend em modo de desenvolvimento
 * - Fallback silencioso quando backend está online
 * 
 * @returns JSX com alerta de status ou null quando backend está online
 */
export default function BackendStatus() {
  const [isBackendAvailable, setIsBackendAvailable] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  /**
   * Efeito para verificar status do backend na montagem do componente.
   * 
   * Executa uma requisição de teste para o endpoint de classes de documentos
   * para determinar se o backend está disponível e funcional.
   */
  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        const response = await fetch('http://localhost:3001/document-classes', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          setIsBackendAvailable(true);
        } else {
          setIsBackendAvailable(false);
        }
      } catch (error) {
        setIsBackendAvailable(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkBackendStatus();
  }, []);

  if (isChecking) {
    return null; 
  }

  if (!isBackendAvailable) {
    return (
      <Alert className="bg-yellow-50 border-yellow-200">
        <AlertDescription>
          ⚠️ <strong>Modo Demonstração:</strong> Backend não disponível em localhost:3001. 
          Usando dados mock para demonstração. Para conectar ao backend real, certifique-se de que ele esteja rodando.
          <br />
          <small className="text-xs text-muted-foreground mt-1 block">
            Para iniciar o backend, execute: <code className="bg-gray-100 px-1 rounded">cd backend && npm run start:dev</code>
          </small>
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}
