'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Users, CreditCard, Trophy, PlusCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from "../common/Navbar"
import { useGames } from '@/hooks/useGames'
import { Skeleton } from "@/components/ui/skeleton"
import {useToast} from '@/hooks/use-toast'
import { useRecoilValue } from 'recoil'
import { authTokenState } from '@/store/AuthState'

export interface Game {
  gameId: string;
  gameType: 'LUDO' | 'FAST_LUDO' | 'RUMMY' | 'CRICKET';
  maxPlayers: number;
  entryFee: number;
  prizePool: number;
  currency: string;
  isActive: boolean;
}

const role = 'superadmin' // This should be dynamically set based on the user's role

export default function GameManager() {
  const {games, setGames, loading} = useGames()
  const [isToggleModalOpen, setIsToggleModalOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [newGame, setNewGame] = useState<Partial<Game>>({
    gameType: 'LUDO',
    maxPlayers: 4,
    entryFee: 100,
    prizePool: 500,
    currency: '₹',
  })
  const [isCreating, setIsCreating] = useState(false);
  const {toast} = useToast()
  const token = useRecoilValue(authTokenState)

  const handleToggleActive = (game: Game) => {
    setSelectedGame(game)
    setIsToggleModalOpen(true)
  }

  const confirmToggleActive = () => {
    if (selectedGame) {
      setGames(games.map(game =>
        game.gameId === selectedGame.gameId
          ? { ...game, isActive: !game.isActive }
          : game
      ))
      setIsToggleModalOpen(false)
    }
  }

  const handleCreateGame = async () => {
    if(!token) return
    setIsCreating(true);
    // Simulating API call
    const response = await fetch('https://klikverse-production.up.railway.app/api/game/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token
        },
        body: JSON.stringify({gameType: newGame.gameType, maxPlayers: newGame.maxPlayers, entryFee: newGame.entryFee, prizePool: newGame.prizePool}),
  
    })
    if(response.ok){
        const data = await response.json();
        const gameId: string = data.gameId;
        setGames([...games, { ...newGame as Game, gameId: gameId, isActive: true }]);
        toast({
            title: "Game Created Successfully",
            description: "New game created successfully.",
            className: "bg-green-500 text-white"
        })
    }
    else{
        toast({
            title: "Failed to Create Game",
            description: "Failed to create new game. Please try again later.",
            variant: "destructive"
        })
    }
    setIsCreating(false)
    setIsCreateModalOpen(false)
    setNewGame({
      gameType: 'LUDO',
      maxPlayers: 4,
      entryFee: 100,
      prizePool: 500,
      currency: '₹',
    })
  }

  const GameSkeleton = () => (
    <Card className="bg-white shadow-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
        <Skeleton className="h-6 w-24 bg-white/20" />
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2">
          {[1, 2, 3].map((_, index) => (
            <Skeleton key={index} className="h-4 w-full" />
          ))}
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 p-4">
        <Skeleton className="h-8 w-full" />
      </CardFooter>
    </Card>
  )

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Navbar />
      <div className="flex-1 bg-gradient-to-br from-gray-100 to-gray-200 p-4 md:p-6 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Game Manager</h1>
          {role === 'superadmin' && (
            <Button onClick={() => setIsCreateModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
              <PlusCircle className="mr-2 h-5 w-5" />
              Create New Game
            </Button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {loading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <GameSkeleton key={index} />
            ))
          ) : (
            games.map((game) => (
              <Card key={game.gameId} className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
                  <CardTitle className="flex justify-between items-center">
                    <span className="text-lg font-semibold">{game.gameType}</span>
                    <Badge variant={game.isActive ? "default" : "secondary"} className="text-xs px-2 py-1">
                      {game.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      <span>Max Players: {game.maxPlayers}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <CreditCard className="w-4 h-4 mr-2" />
                      <span>Entry Fee: ₹{game.entryFee}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Trophy className="w-4 h-4 mr-2" />
                      <span>Prize Pool: ₹{game.prizePool}</span>
                    </div>
                  </div>
                </CardContent>
                {role === 'superadmin' && (
                  <CardFooter className="bg-gray-50 p-4">
                    <Button
                      variant={game.isActive ? "outline" : "default"}
                      size="sm"
                      className="w-full"
                      onClick={() => handleToggleActive(game)}
                    >
                      {game.isActive ? 'Disable' : 'Enable'}
                    </Button>
                  </CardFooter>
                )}
              </Card>
            ))
          )}
        </div>
      </div>

      <Dialog open={isToggleModalOpen} onOpenChange={setIsToggleModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogDescription>
              Are you sure you want to {selectedGame?.isActive ? 'disable' : 'enable'} the {selectedGame?.gameType} game?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsToggleModalOpen(false)}>Cancel</Button>
            <Button onClick={confirmToggleActive}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">Create New Game</DialogTitle>
            <DialogDescription className="text-center">
              Fill in the details below to create a new game.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="gameType">Game Type</Label>
              <Select
                value={newGame.gameType}
                onValueChange={(value: Game['gameType']) => setNewGame({...newGame, gameType: value})}
              >
                <SelectTrigger id="gameType" className="w-full">
                  <SelectValue placeholder="Select a game type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LUDO">LUDO</SelectItem>
                  <SelectItem value="FAST_LUDO">FAST LUDO</SelectItem>
                  <SelectItem value="RUMMY">RUMMY</SelectItem>
                  <SelectItem value="CRICKET">CRICKET</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxPlayers">Max Players</Label>
              <Input
                id="maxPlayers"
                type="number"
                value={newGame.maxPlayers}
                onChange={(e) => setNewGame({...newGame, maxPlayers: parseInt(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="entryFee">Entry Fee (₹)</Label>
              <Input
                id="entryFee"
                type="number"
                value={newGame.entryFee}
                onChange={(e) => setNewGame({...newGame, entryFee: parseFloat(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prizePool">Prize Pool (₹)</Label>
              <Input
                id="prizePool"
                type="number"
                value={newGame.prizePool}
                onChange={(e) => setNewGame({...newGame, prizePool: parseFloat(e.target.value)})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsCreateModalOpen(false)} variant="outline" className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button onClick={handleCreateGame} disabled={isCreating} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">
              {isCreating ? (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center"
                  >
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </motion.div>
                </AnimatePresence>
              ) : (
                'Create Game'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}