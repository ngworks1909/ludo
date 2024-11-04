
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { ArrowDownRight, ArrowUpRight } from "lucide-react"

export default function GameCard({game}: {game: {name: string, icon: string, count: number, change: number}}) {
  return (
    <Card className="overflow-hidden">
              <CardHeader className="border-b p-0">
                <div className="flex items-center justify-between p-4">
                  <CardTitle className="text-base font-semibold">{game.name}</CardTitle>
                  <span className="text-3xl">{game.icon}</span>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex items-baseline justify-between">
                  <div>
                    <p className="text-2xl font-bold">{game.count.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">games played this month</p>
                  </div>
                  <div className={`flex flex-col items-end ${game.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      <div className="flex items-center">
                        {game.change >= 0 ? (
                          <ArrowUpRight className="h-4 w-4 mr-1" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 mr-1" />
                        )}
                        <span className="text-sm font-medium">{Math.abs(game.change)}%</span>
                      </div>
                      <p className="text-xs text-muted-foreground">from last month</p>
                    </div>
                </div>
              </CardContent>
      </Card>
  )
}
