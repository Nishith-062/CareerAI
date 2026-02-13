// components/StatCard.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type { ReactNode } from "react"

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon: ReactNode
  valueClassName?: string
  iconClassName?: string
  iconWrapperClassName?: string
  footer?: ReactNode
}

export function StatCard({
  title,
  value,
  description,
  icon,
  valueClassName,
  iconClassName,
  iconWrapperClassName,
  footer,
}: StatCardProps) {
  return (
    <Card className="border-border/50 bg-card/70 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex items-end justify-between">
          <div className={`text-4xl font-bold ${valueClassName}`}>
            {value}
          </div>

          <div
            className={`h-8 w-8 rounded-full flex items-center justify-center ${iconWrapperClassName}`}
          >
            <span className={iconClassName}>{icon}</span>
          </div>
        </div>

        {description && (
          <p className="text-xs text-muted-foreground mt-4">
            {description}
          </p>
        )}

        {footer}
      </CardContent>
    </Card>
  )
}

