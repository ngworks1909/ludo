'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { useRecoilValue } from 'recoil'
import { authTokenState } from '@/store/AuthState'
import Navbar from '../common/Navbar'
import { host } from '@/lib/host'

export default function PushNotificationSender() {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [isSending, setIsSending] = useState(false);
  const token = useRecoilValue(authTokenState);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!token) return
    if (!title.trim() || !body.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both title and body fields.",
        variant: "destructive",
      })
      return
    }

    setIsSending(true)
    // Simulating API call
    const response = await fetch(`${host}/api/admin/sendmessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token
        },
        body: JSON.stringify({
          title,
          body,
        }),
    })

    if (response.ok) {
        toast({
            title: "Notification Sent",
            description: "Your push notification has been sent successfully.",
        })
    }
    else{
        toast({
            title: "Error",
            description: "Failed to send push notification. Please try again later.",
            variant: "destructive",
        })
    }
    // Here you would typically send the notification using your backend API
    
    setTitle('')
    setBody('')
    setIsSending(false)
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Navbar />
      <main className="flex-1 overflow-auto p-4 md:p-6 flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-6 text-center">Send Push Notification</h1>
          <form onSubmit={handleSend} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter notification title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="body">Body</Label>
              <Textarea
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Enter notification body"
                required
                className="min-h-[100px]"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSending}>
              {isSending ? 'Sending...' : 'Send Notification'}
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}