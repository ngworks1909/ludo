'use client'

import { useState } from 'react'
import Navbar from "../common/Navbar"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, IndianRupee } from 'lucide-react'
import { motion } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"
import { usePayments } from '@/hooks/usePayments'
import { authTokenState, userRoleState } from '@/store/AuthState'
import { useRecoilValue } from 'recoil'
import { Navigate } from 'react-router-dom'

export interface Payment {
    withdrawId: string;
    amount: number;
    status: "PENDING" | "SUCCESS" | "FAILED";
    timestamp: Date;
    user: {
        username: string;
    };
}

export default function Payments() {
  
  const [paymentStates, setPaymentStates] = useState<{ [key: string]: { isApproving: boolean, status: Payment['status'] } }>({})
  const {payments, setPayments, loading} = usePayments();
  const token = useRecoilValue(authTokenState)
  const role = useRecoilValue(userRoleState)
  if (!role) {
    return <Navigate to="/login" replace />
  }

  const handleApprove = async(id: string) => {
    if(!token) return
    setPaymentStates(prev => ({
      ...prev,
      [id]: { ...prev[id], isApproving: true }
    }))

    const response = await fetch(`https://klikverse-production.up.railway.app/api/transactions/updatewithdraw/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'authorization': token
      }
    });

    if(response.ok){
        setPaymentStates(prev => ({
            ...prev,
            [id]: { isApproving: false, status: 'SUCCESS' }
        }));

        setPayments(prev => prev.map(payment => 
          payment.withdrawId === id ? { ...payment, status: 'SUCCESS' } : payment
        ))
    }
    else{
        setPaymentStates(prev => ({
            ...prev,
            [id]: { isApproving: false, status: 'FAILED' }
        }))
    }
  }

  const getStatusColor = (status: Payment['status']) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-500'
      case 'SUCCESS': return 'bg-green-500'
      case 'FAILED': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const SkeletonCard = () => (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4 mb-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-4 w-[100px]" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 dark:bg-gray-800 p-4">
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  )

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <h1 className="text-3xl font-bold mb-6">Payment Requests</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            Array(6).fill(0).map((_, index) => <SkeletonCard key={index} />)
          ) : (
            payments.map((payment) => (
              <motion.div
                key={payment.withdrawId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="overflow-hidden transition-shadow duration-300 hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <Avatar>
                        <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${payment.user.username}`} />
                        <AvatarFallback>{payment.user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="text-xl font-semibold">{payment.user.username}</h2>
                        <p className="text-sm text-gray-500">
                          {payment.timestamp.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Amount:</span>
                        <span className="font-semibold flex items-center">
                          <IndianRupee className="h-4 w-4 mr-1" />
                          {payment.amount.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Status:</span>
                        <Badge className={`${getStatusColor(paymentStates[payment.withdrawId]?.status || payment.status)} transition-colors duration-300`}>
                          {paymentStates[payment.withdrawId]?.status || payment.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                  {(role === 'admin' || role === 'superadmin') && (paymentStates[payment.withdrawId]?.status || payment.status) === 'PENDING' && (
                    <CardFooter className="bg-gray-50 dark:bg-gray-800 p-4">
                      <Button 
                        className="w-full transition-all duration-300 hover:bg-green-600"
                        onClick={() => handleApprove(payment.withdrawId)}
                        disabled={paymentStates[payment.withdrawId]?.isApproving}
                      >
                        {paymentStates[payment.withdrawId]?.isApproving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Approving...
                          </>
                        ) : (
                          'Approve'
                        )}
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}