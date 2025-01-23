'use client'

import { useState } from 'react'
import Navbar from "../common/Navbar"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Phone, Search, Gamepad2, Trophy, TrendingUp, TrendingDown, Wallet, X, Eye, AlertCircle } from "lucide-react"
import { Badge } from '../ui/badge'
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { useUsers } from '@/hooks/useUsers'
import { useRecoilValue } from 'recoil'
import { authTokenState, userRoleState } from '@/store/AuthState'
import { useToast } from '@/hooks/use-toast'
import { host } from '@/lib/host'

export type User = {
  userId: string;
  username: string;
  mobile: string;
  suspended: boolean;
  wallet: {
    totalBalance: number;
  }[];
}

function formatIndianNumber(num: number): string {
  return num.toLocaleString('en-IN');
}

function UserCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div>
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <Skeleton className="h-6 w-20" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-20 w-full" />
          ))}
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 dark:bg-gray-800 p-4 flex justify-between">
        <Skeleton className="h-10 w-[48%]" />
        <Skeleton className="h-10 w-[48%]" />
      </CardFooter>
    </Card>
  )
}

export default function Users() {
  const { users, loading, setUsers } = useUsers()
  const [searchTerm, setSearchTerm] = useState('')
  const [suspendUserId, setSuspendUserId] = useState<string | null>(null)
  const [isSuspendDialogOpen, setIsSuspendDialogOpen] = useState(false)
  const userRole = useRecoilValue(userRoleState)
  const token = useRecoilValue(authTokenState)
  const { toast } = useToast()

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.mobile.includes(searchTerm)
  )

  const handleSuspendUser = (userId: string) => {
    setSuspendUserId(userId)
    setIsSuspendDialogOpen(true)
  }

  const confirmSuspendUser = async () => {
    try {
      if (suspendUserId && token) {
        setUsers(users.map(user => 
          user.userId === suspendUserId ? { ...user, suspended: true } : user
        ))
        const response = await fetch(`${host}/api/user/suspend/${suspendUserId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "authorization": token
          },
        })
        if (response.ok) {
          toast({
            title: "User Suspended",
            description: "User has been suspended.",
            className: "bg-green-500 text-white"
          })
        }
        setIsSuspendDialogOpen(false)
        setSuspendUserId(null)
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: "User Suspension Failed",
        description: "Failed to suspend the user.",
        className: "bg-red-500 text-white"
      })
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Users</h1>
            <div className="text-lg text-gray-600 dark:text-gray-400 mt-2">
              Total Users: {loading ? <Skeleton className="w-20 h-6 inline-block" /> : formatIndianNumber(users.length)}
            </div>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <UserCardSkeleton key={index} />
              ))
            : filteredUsers.map((user) => (
                <UserCard
                  key={user.userId}
                  user={user}
                  userRole={userRole || "employee"}
                  onSuspend={handleSuspendUser}
                />
              ))}
        </div>
        {!loading && filteredUsers.length === 0 && (
          <div className="text-center mt-12">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-xl font-semibold text-gray-700 dark:text-gray-300">No users found</h3>
            <p className="mt-1 text-gray-500 dark:text-gray-400">Try adjusting your search terms</p>
          </div>
        )}
      </main>

      <Dialog open={isSuspendDialogOpen} onOpenChange={setIsSuspendDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suspend User</DialogTitle>
            <DialogDescription>
              Are you sure you want to suspend this user? This action can be reversed later.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSuspendDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmSuspendUser}>Confirm Suspension</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface UserCardProps {
  user: User;
  userRole: string;
  onSuspend: (userId: string) => void;
}

function UserCard({ user, userRole, onSuspend }: UserCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16 border-2 border-gray-300 dark:border-gray-700">
              <AvatarImage src={`https://i.pravatar.cc/150?img=${user.userId}`} alt={user.username} />
              <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{user.username}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                <Phone size={16}/>
                <span>{`+91 ${user.mobile}`}</span>
              </p>
            </div>
          </div>
          <Badge 
            variant={user.suspended ? "destructive" : "secondary"} 
            className="h-6 flex items-center gap-1"
          >
            {user.suspended ? <AlertCircle size={14} /> : <User size={14} />}
            {user.suspended ? 'Suspended' : 'Active'}
          </Badge>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <UserStat icon={Gamepad2} label="Total Matches" value={100} color="blue" />
          <UserStat icon={Trophy} label="Matches Won" value={20} color="green" />
          <UserStat icon={X} label="Matches Lost" value={80} color="red" />
          <UserStat icon={TrendingUp} label="Amount Won" value={2000} prefix="₹" color="emerald" />
          <UserStat icon={TrendingDown} label="Amount Lost" value={5000} prefix="₹" color="rose" />
          <UserStat icon={Wallet} label="Wallet Balance" value={1000} prefix="₹" color="purple" />
        </div>
      </CardContent>
      {(userRole === 'superadmin' || userRole === "admin") && (
        <CardFooter className="bg-gray-50 dark:bg-gray-800 p-4 flex justify-between">
          <Button variant="outline" className="w-[48%] flex items-center justify-center">
            <Eye className="mr-2 h-4 w-4" /> View Details
          </Button>
          <Button 
            variant="destructive"
            className="w-[48%] flex items-center justify-center"
            onClick={() => onSuspend(user.userId)}
            disabled={user.suspended}
          >
            <AlertCircle className="mr-2 h-4 w-4" />
            {user.suspended ? 'Suspended' : 'Suspend User'}
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

interface UserStatProps {
  icon: React.ElementType;
  label: string;
  value: number;
  prefix?: string;
  color: string;
}

function UserStat({ icon: Icon, label, value, prefix, color }: UserStatProps) {
  const colorClasses = {
    blue: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
    green: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
    red: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
    emerald: 'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200',
    rose: 'bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-200',
    purple: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200',
  }

  return (
    <div className={`flex flex-col items-center justify-center rounded-lg p-3 transition-all duration-300 ${colorClasses[color as keyof typeof colorClasses]}`}>
      <Icon size={24} className="mb-2" />
      <span className="text-sm font-medium mb-1">{label}</span>
      <span className="font-semibold text-lg">
        {prefix && <span className="mr-1">{prefix}</span>}
        {formatIndianNumber(value)}
      </span>
    </div>
  )
}