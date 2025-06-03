import { CreditCard, DollarSign, Users } from "lucide-react"
import Navbar from "../common/Navbar"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Skeleton } from "../ui/skeleton"
import GameCard from "./GameCard"
import { useDashboard } from "@/hooks/useDashboard"

export default function Dashboard() {
  const gameStats = [
    { name: "MEMORYGAME", count: 4231, change: 20.1, icon: "🧠" },     // Brain for memory
{ name: "LUDO", count: 3621, change: -19, icon: "🎲" },           // Dice for Ludo
{ name: "CRICKET", count: 3621, change: -19, icon: "🏏" },        // Bat and ball for cricket
{ name: "RUMMY", count: 3621, change: -19, icon: "🃏" },          // Joker card for Rummy
{ name: "FAST_LUDO", count: 3621, change: -19, icon: "⚡🎲" }     // Fast Ludo with lightning + dice
  ]

  const {data, loading} = useDashboard()


  return (
    <div className="flex min-h-screen w-full flex-col">
      <Navbar/>
      <main className="flex-1 overflow-auto bg-gray-50 p-4 md:p-6 dark:bg-gray-900">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Game performance overview</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Active Users Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ) : (
                <>
                  <div className="text-3xl font-bold">{data?.userCount.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground mt-1">Users playing your game</p>
                </>
              )}
            </CardContent>
          </Card>

          {/* Payments Collected Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Payments Secured</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ) : (
                <>
                  <div className="text-3xl font-bold">
                    ₹
                    {data?.payments.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Total revenue secured</p>
                </>
              )}
            </CardContent>
          </Card>

          {/* Payouts Made Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Payouts Made</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ) : (
                <>
                  <div className="text-3xl font-bold">
                    ₹
                    {data?.withdrawls.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Total payouts processed</p>
                </>
              )}
            </CardContent>
          </Card>

        </div>
      </main>
      <main className="flex-1 overflow-auto p-4 md:p-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {gameStats.map((game, index) => (
            <GameCard key={index} game={game} />
          ))}
        </div>
      </main>
    </div>
  )
}