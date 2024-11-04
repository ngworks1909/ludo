import Navbar from "../common/Navbar"
import GameCard from "./GameCard"

export default function Dashboard() {
  const gameStats = [
    { name: "Ludo", count: 4231, change: 20.1, icon: "🎲" },
    { name: "Snake and Ladders", count: 2845, change: 180.1, icon: "🐍" },
    { name: "Cricket", count: 3621, change: -19, icon: "🏏" },
  ]

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Navbar/>
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