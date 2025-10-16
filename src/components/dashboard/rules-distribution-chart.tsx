"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { useDocumentClasses } from "@/hooks/useDocumentClasses"
import { AnonymizationRule } from "@/types"

const COLORS = {
  [AnonymizationRule.ALLOWED]: "#22c55e",
  [AnonymizationRule.RESTRICTED]: "#eab308", 
  [AnonymizationRule.NOT_ALLOWED]: "#ef4444"
}

export function RulesDistributionChart() {
  const { data: documentClasses, loading, error } = useDocumentClasses()

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Distribuição das Regras</CardTitle>
          <CardDescription>Carregando dados...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Distribuição das Regras</CardTitle>
          <CardDescription>Erro ao carregar dados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            {error}
          </div>
        </CardContent>
      </Card>
    )
  }

  const distribution = documentClasses.reduce(
    (acc, docClass) => {
      if (docClass.rule) {
        acc[docClass.rule] = (acc[docClass.rule] || 0) + 1
      }
      
      (docClass.types || docClass.documentTypes || []).forEach(docType => {
        if (docType.rule) {
          acc[docType.rule] = (acc[docType.rule] || 0) + 1
        }
        
        (docType.labels || []).forEach(label => {
          if (label.rule) {
            acc[label.rule] = (acc[label.rule] || 0) + 1
          }
        })
      })
      
      return acc
    },
    {} as Record<AnonymizationRule, number>
  )

  const chartData = [
    {
      name: "Permitidas",
      value: distribution[AnonymizationRule.ALLOWED] || 0,
      color: COLORS[AnonymizationRule.ALLOWED],
      rule: AnonymizationRule.ALLOWED
    },
    {
      name: "Restritas", 
      value: distribution[AnonymizationRule.RESTRICTED] || 0,
      color: COLORS[AnonymizationRule.RESTRICTED],
      rule: AnonymizationRule.RESTRICTED
    },
    {
      name: "Bloqueadas",
      value: distribution[AnonymizationRule.NOT_ALLOWED] || 0,
      color: COLORS[AnonymizationRule.NOT_ALLOWED],
      rule: AnonymizationRule.NOT_ALLOWED
    }
  ]

  const total = chartData.reduce((sum, item) => sum + item.value, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribuição das Regras</CardTitle>
        <CardDescription>
          Visualização da distribuição das regras de anonimização por categoria
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ChartContainer
            config={{
              allowed: { label: "Permitidas", color: COLORS[AnonymizationRule.ALLOWED] },
              restricted: { label: "Restritas", color: COLORS[AnonymizationRule.RESTRICTED] },
              notAllowed: { label: "Bloqueadas", color: COLORS[AnonymizationRule.NOT_ALLOWED] }
            }}
            className="h-full w-full"
          >
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => [
                      `${value} regras`,
                      name
                    ]}
                  />
                }
              />
            </PieChart>
          </ChartContainer>
        </div>
        
        <div className="mt-4 space-y-2">
          {chartData.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm font-medium">{item.name}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {item.value} ({total > 0 ? Math.round((item.value / total) * 100) : 0}%)
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
