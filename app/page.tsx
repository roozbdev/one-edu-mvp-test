'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser, getUserProfile } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles, MessageCircle, Trophy, Users } from 'lucide-react'

export default function Home() {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser()
        if (user) {
          const { data: profile } = await getUserProfile(user.id)
          if (profile) {
            if (profile.role === 'child') {
              router.push('/dashboard')
            } else {
              router.push('/parent')
            }
          } else {
            router.push('/role-select')
          }
        }
      } catch (error) {
        console.error('Error checking auth:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center floating-animation">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Meet Astra
          </CardTitle>
          <CardDescription className="text-lg text-gray-600 mt-2">
            Your friendly AI mentor is here to help you grow and learn new skills!
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                <MessageCircle className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-sm text-gray-600">Chat & Learn</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                <Trophy className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-sm text-gray-600">Earn XP</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-2">
                <Users className="h-6 w-6 text-yellow-600" />
              </div>
              <span className="text-sm text-gray-600">Grow Skills</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <Button 
              onClick={() => router.push('/auth')}
              className="w-full py-6 text-lg font-semibold gradient-bg hover:opacity-90 transition-opacity"
            >
              Get Started
            </Button>
            
            <Button 
              onClick={() => router.push('/auth?mode=signin')}
              variant="outline"
              className="w-full py-6 text-lg font-semibold border-2 border-purple-200 hover:bg-purple-50"
            >
              I Already Have an Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}