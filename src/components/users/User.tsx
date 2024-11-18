'use client'

import { useState } from 'react'
import Navbar from "../common/Navbar"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Phone, IndianRupee, Search, Gamepad2, Trophy, TrendingUp, TrendingDown, Wallet, X } from "lucide-react"
import { Badge } from '../ui/badge'
import { Skeleton } from '../ui/skeleton'
import { useUsers } from '@/hooks/useUsers'

export type User = {
  userId: string;
  username: string;
  mobile: string;
  wallet: {
      totalBalance: number;
  }[];
}

// Function to format number in Indian numbering system
function formatIndianNumber(num: number): string {
  const formatted = num.toLocaleString('en-IN');
  return formatted;
}

const SkeletonCard = () => (
  <Card className="overflow-hidden">
    <CardContent className="p-6">
      <div className="flex items-center space-x-4 mb-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[150px]" />
        </div>
      </div>
      <div className="space-y-3">
        {[...Array(2)].map((_, index) => (
          <Skeleton key={index} className="h-4 w-full">
          </Skeleton>
        ))}
        <Skeleton className='h-4 w-[50%]'></Skeleton>
      </div>
    </CardContent>
  </Card>
)

export default function Users() {
  const {users, loading} = useUsers()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
    user.mobile.includes(searchTerm)
  )

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-100 dark:bg-gray-900">
      <Navbar/>
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Users</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
              Total Users: {formatIndianNumber(users.length)}
            </p>
          </div>
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full md:w-64 bg-white"
            />
          </div>
        </div>

        {loading ?  
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, index) => <SkeletonCard key={index} />)}
        </div>
 : <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.map((user) => (
            <Card key={user.userId} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={"https://i.pravatar.cc/150?img=5"} alt={user.username} />
                  <AvatarFallback>{user.username.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{user.username}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Phone size={16}/>
                    <span>{`+91 ${user.mobile}`}</span>
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Gamepad2 size={18} className="text-blue-500" />
                    <span className="text-sm font-medium">Total Matches:</span>
                  </div>
                  <Badge variant="secondary">{190}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Trophy size={18} className="text-green-500" />
                    <span className="text-sm font-medium">Matches Won:</span>
                  </div>
                  <Badge variant="default">{90}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <X size={18} className="text-red-500" />
                    <span className="text-sm font-medium">Matches Lost:</span>
                  </div>
                  <Badge variant="destructive">{100}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <TrendingUp size={18} className="text-green-500" />
                    <span className="text-sm font-medium">Amount Won:</span>
                  </div>
                  <span className="text-green-600 font-semibold flex items-center">
                    <IndianRupee size={16} />
                    <span>{10000}</span>
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <TrendingDown size={18} className="text-red-500" />
                    <span className="text-sm font-medium">Amount Lost:</span>
                  </div>
                  <span className="text-red-600 font-semibold flex items-center">
                  <IndianRupee size={16} />
                  <span>{2000}</span>
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <div className="flex items-center space-x-2">
                    <Wallet size={18} className="text-purple-500" />
                    <span className="text-sm font-medium">Wallet Balance:</span>
                  </div>
                  <span className="text-purple-600 font-semibold flex items-center">
                  <IndianRupee size={16} />
                  <span>{1000}</span>
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          ))}
        </div>
        {filteredUsers.length === 0 && (
          <div className="text-center mt-12">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-xl font-semibold text-gray-700 dark:text-gray-300">No users found</h3>
            <p className="mt-1 text-gray-500 dark:text-gray-400">Try adjusting your search terms</p>
          </div>
        )}
          </>}
        
      </main>
    </div>
  )
}