"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AnonymizationRule, RuleReport, ReportFilters, RULE_LABELS, RULE_COLORS } from "@/types";
import { apiClient } from "@/lib/api";
import { IconArrowLeft } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export default function RelatoriosPage() {
  const router = useRouter();
  const [reports, setReports] = useState<RuleReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ReportFilters>({});
  const [filteredReports, setFilteredReports] = useState<RuleReport[]>([]);

  useEffect(() => {
    loadReports();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [reports, filters]);

  const loadReports = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getRules();
      
      const reports = [];
      
      if (data.classes) {
        for (const docClass of data.classes) {
          if (docClass.rule) {
            reports.push({
              documentClassName: docClass.name,
              rule: docClass.rule,
              days: docClass.restrictionDays,
              level: 'class'
            });
          }
        }
      }
      
      if (data.types) {
        for (const docType of data.types) {
          if (docType.rule) {
            reports.push({
              documentClassName: docType.class.name,
              documentTypeName: docType.name,
              rule: docType.rule,
              days: docType.restrictionDays,
              level: 'type'
            });
          }
        }
      }
      
      if (data.labels) {
        for (const label of data.labels) {
          if (label.rule) {
            reports.push({
              documentClassName: label.type.class.name,
              documentTypeName: label.type.name,
              labelName: label.name,
              rule: label.rule,
              days: label.restrictionDays,
              level: 'label'
            });
          }
        }
      }
      
      setReports(reports);
    } catch (error) {
      console.error('Erro ao carregar relatórios:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...reports];

    if (filters.rule) {
      filtered = filtered.filter(report => report.rule === filters.rule);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(report =>
        report.documentClassName.toLowerCase().includes(searchLower) ||
        report.documentTypeName?.toLowerCase().includes(searchLower) ||
        report.labelName?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.documentClass) {
      filtered = filtered.filter(report => 
        report.documentClassName === filters.documentClass
      );
    }

    setFilteredReports(filtered);
  };

  const exportData = () => {
    const csvContent = [
      ['Classe', 'Tipo', 'Rótulo', 'Regra', 'Dias', 'Nível'].join(','),
      ...filteredReports.map(report => [
        report.documentClassName,
        report.documentTypeName || '',
        report.labelName || '',
        RULE_LABELS[report.rule],
        report.days || '',
        report.level
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'relatorio-regras-anonimizacao.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const getRuleBadge = (rule: AnonymizationRule, days?: number) => {
    const colors = RULE_COLORS[rule];
    const label = rule === AnonymizationRule.RESTRICTED && days 
      ? `🟨 Restrito (${days}d)`
      : RULE_LABELS[rule];
    
    return (
      <Badge className={colors.badge}>
        {label}
      </Badge>
    );
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'class': return '📁';
      case 'type': return '📄';
      case 'label': return '🏷️';
      default: return '❓';
    }
  };

  const getUniqueDocumentClasses = () => {
    const classes = new Set(reports.map(r => r.documentClassName));
    return Array.from(classes).sort();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando relatórios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            onClick={() => router.push("/")} 
            variant="outline" 
            size="sm"
            className="flex items-center gap-2"
          >
            <IconArrowLeft className="h-4 w-4" />
            Voltar à Página Principal
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Relatórios de Regras</h2>
            <p className="text-muted-foreground">
              Visualize um resumo consolidado das regras de anonimização aplicadas
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportData} variant="outline">
            📥 Exportar CSV
          </Button>
          <Button onClick={loadReports} variant="outline">
            Atualizar
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Buscar</label>
              <Input
                placeholder="Nome da classe, tipo ou rótulo..."
                value={filters.search || ''}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Classe de Documento</label>
              <Select
                value={filters.documentClass || 'all'}
                onValueChange={(value) => setFilters({ ...filters, documentClass: value === 'all' ? undefined : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas as classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as classes</SelectItem>
                  {getUniqueDocumentClasses().map((className) => (
                    <SelectItem key={className} value={className}>
                      {className}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Tipo de Regra</label>
              <Select
                value={filters.rule || 'all'}
                onValueChange={(value) => setFilters({ ...filters, rule: value === 'all' ? undefined : value as AnonymizationRule })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas as regras" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as regras</SelectItem>
                  <SelectItem value={AnonymizationRule.ALLOWED}>🟩 Permitido</SelectItem>
                  <SelectItem value={AnonymizationRule.RESTRICTED}>🟨 Restrito</SelectItem>
                  <SelectItem value={AnonymizationRule.NOT_ALLOWED}>🟥 Não Permitido</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => setFilters({})}
                className="w-full"
              >
                Limpar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{filteredReports.length}</div>
              <div className="text-sm text-muted-foreground">Total de Itens</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {filteredReports.filter(r => r.rule === AnonymizationRule.ALLOWED).length}
              </div>
              <div className="text-sm text-muted-foreground">Permitidos</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {filteredReports.filter(r => r.rule === AnonymizationRule.RESTRICTED).length}
              </div>
              <div className="text-sm text-muted-foreground">Restritos</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {filteredReports.filter(r => r.rule === AnonymizationRule.NOT_ALLOWED).length}
              </div>
              <div className="text-sm text-muted-foreground">Não Permitidos</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Regras Aplicadas</CardTitle>
          <CardDescription>
            Mostrando {filteredReports.length} de {reports.length} itens
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredReports.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum item encontrado com os filtros aplicados.
              </div>
            ) : (
              filteredReports.map((report, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{getLevelIcon(report.level)}</span>
                    <div>
                      <div className="font-medium">
                        {report.labelName ? (
                          <>
                            <span className="text-muted-foreground">{report.documentClassName} → {report.documentTypeName} → </span>
                            <span>{report.labelName}</span>
                          </>
                        ) : report.documentTypeName ? (
                          <>
                            <span className="text-muted-foreground">{report.documentClassName} → </span>
                            <span>{report.documentTypeName}</span>
                          </>
                        ) : (
                          report.documentClassName
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground capitalize">
                        Nível: {report.level === 'class' ? 'Classe' : report.level === 'type' ? 'Tipo' : 'Rótulo'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getRuleBadge(report.rule, report.days)}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}