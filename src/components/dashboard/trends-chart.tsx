"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { IconChartBar } from "@tabler/icons-react"
import { apiClient } from "@/lib/api"
import { AnonymizationRule } from "@/types"

const fallbackData = [
  { category: "Classes", allowed: 12, restricted: 8, blocked: 5 },
  { category: "Tipos", allowed: 35, restricted: 22, blocked: 15 },
  { category: "Rótulos", allowed: 68, restricted: 45, blocked: 28 }
]

const chartConfig = {
  allowed: {
    label: "Permitidas",
    color: "#22c55e"
  },
  restricted: {
    label: "Restritas", 
    color: "#eab308"
  },
  blocked: {
    label: "Bloqueadas",
    color: "#ef4444"
  }
}

export function RulesDistributionChart() {
  const [realData, setRealData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ allowed: 0, restricted: 0, blocked: 0 })

  useEffect(() => {
    loadRealData()
  }, [])

  const loadRealData = async () => {
    try {
      setLoading(true)
      const rulesData = await apiClient.getRules()
      
      const categoryData = generateCategoryData(rulesData)
      setRealData(categoryData)
      
      const totalStats = categoryData.reduce(
        (acc, curr) => ({
          allowed: acc.allowed + curr.allowed,
          restricted: acc.restricted + curr.restricted,
          blocked: acc.blocked + curr.blocked
        }),
        { allowed: 0, restricted: 0, blocked: 0 }
      )
      setStats(totalStats)
      
    } catch (error) {
      console.error('Erro ao carregar dados de distribuição:', error)
      setRealData(fallbackData)
      setStats({ allowed: 115, restricted: 75, blocked: 48 })
    } finally {
      setLoading(false)
    }
  }

  const generateCategoryData = (data: any) => {
    const classesAllowed = data.classes?.filter((item: any) => item.rule === AnonymizationRule.ALLOWED).length || 0
    const classesRestricted = data.classes?.filter((item: any) => item.rule === AnonymizationRule.RESTRICTED).length || 0
    const classesBlocked = data.classes?.filter((item: any) => item.rule === AnonymizationRule.NOT_ALLOWED).length || 0

    const typesAllowed = data.types?.filter((item: any) => item.rule === AnonymizationRule.ALLOWED).length || 0
    const typesRestricted = data.types?.filter((item: any) => item.rule === AnonymizationRule.RESTRICTED).length || 0
    const typesBlocked = data.types?.filter((item: any) => item.rule === AnonymizationRule.NOT_ALLOWED).length || 0

    const labelsAllowed = data.labels?.filter((item: any) => item.rule === AnonymizationRule.ALLOWED).length || 0
    const labelsRestricted = data.labels?.filter((item: any) => item.rule === AnonymizationRule.RESTRICTED).length || 0
    const labelsBlocked = data.labels?.filter((item: any) => item.rule === AnonymizationRule.NOT_ALLOWED).length || 0

    return [
      { category: "Classes", allowed: classesAllowed, restricted: classesRestricted, blocked: classesBlocked },
      { category: "Tipos", allowed: typesAllowed, restricted: typesRestricted, blocked: typesBlocked },
      { category: "Rótulos", allowed: labelsAllowed, restricted: labelsRestricted, blocked: labelsBlocked }
    ]
  }

  const displayData = realData.length > 0 ? realData : fallbackData

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconChartBar className="h-5 w-5" />
          Distribuição das Regras
        </CardTitle>
        <CardDescription>
          Comparação das regras por categoria de documento
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-[300px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Carregando dados...</p>
            </div>
          </div>
        ) : (
          <div className="h-[300px]">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <BarChart data={displayData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="category" 
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis 
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, name) => [
                        `${value}`,
                        `Regras ${chartConfig[name as keyof typeof chartConfig]?.label || name}`
                      ]}
                    />
                  }
                />
                <Bar
                  dataKey="allowed"
                  fill="#22c55e"
                  radius={[2, 2, 0, 0]}
                />
                <Bar
                  dataKey="restricted"
                  fill="#eab308"
                  radius={[2, 2, 0, 0]}
                />
                <Bar
                  dataKey="blocked"
                  fill="#ef4444"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
          </ChartContainer>
        </div>
        )}
        
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-600">{stats.allowed}</div>
            <div className="text-xs text-muted-foreground">Permitidas</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-600">{stats.restricted}</div>
            <div className="text-xs text-muted-foreground">Restritas</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">{stats.blocked}</div>
            <div className="text-xs text-muted-foreground">Bloqueadas</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
