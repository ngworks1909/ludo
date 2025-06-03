'use client'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { motion } from "framer-motion"

export default function GameCard({game}: {game: {name: string, icon: string, count: number, change: number}}) {
  const navigate = useNavigate()
  const [isHovered, setIsHovered] = useState(false)

  

  const handleClick = () => {
    navigate(`/game/${encodeURIComponent(game.name.toUpperCase())}`)
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Card 
        className="overflow-hidden cursor-pointer"
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardHeader className="border-b p-0">
          <div className="flex items-center justify-between p-4">
            <CardTitle className="text-base font-semibold">{game.name}</CardTitle>
            <motion.span 
              className="text-3xl"
              animate={{ rotate: isHovered ? 360 : 0 }}
              transition={{ duration: 0.5 }}
            >
              {game.icon}
            </motion.span>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex items-baseline justify-between">
            <div>
              <motion.p 
                className="text-2xl font-bold"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {game.count.toLocaleString()}
              </motion.p>
              <p className="text-xs text-muted-foreground">games played this month</p>
            </div>
            <div className={`flex flex-col items-end ${game.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              <motion.div 
                className="flex items-center"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                {game.change >= 0 ? (
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                )}
                <span className="text-sm font-medium">{Math.abs(game.change)}%</span>
              </motion.div>
              <p className="text-xs text-muted-foreground">from last month</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}