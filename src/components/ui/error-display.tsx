import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { IconAlertCircle, IconRefresh } from "@tabler/icons-react"

interface ErrorDisplayProps {
  title?: string
  message: string
  onRetry?: () => void
  className?: string
}

export function ErrorDisplay({ 
  title = "Erro", 
  message, 
  onRetry, 
  className 
}: ErrorDisplayProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <IconAlertCircle className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>
          {message}
        </CardDescription>
      </CardHeader>
      {onRetry && (
        <CardContent>
          <Button variant="outline" onClick={onRetry} className="flex items-center gap-2">
            <IconRefresh className="h-4 w-4" />
            Tentar novamente
          </Button>
        </CardContent>
      )}
    </Card>
  )
}
