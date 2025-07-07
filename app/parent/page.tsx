'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser, signOut } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Construction, LogOut, ArrowLeft } from 'lucide-react'

export default function ParentPage() {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const user = await getCurrentUser()
      if (!user) {
        router.push('/auth')
      }
    }
    checkAuth()
  }, [router])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Users className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Parent Dashboard
          </CardTitle>
          <CardDescription className="text-gray-600">
            Coming Soon
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center">
            <Construction className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              We&apos;re Building Something Amazing!
            </h3>
            <p className="text-gray-600 mb-4">
              The parent dashboard is currently in development. You&apos;ll soon be able to:
            </p>
            <ul className="text-sm text-gray-600 space-y-2 text-left">
              <li>• Monitor your child&apos;s learning progress</li>
              <li>• View conversation insights with Astra</li>
              <li>• Set learning goals and preferences</li>
              <li>• Access detailed skill development reports</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <Button 
              onClick={handleSignOut}
              className="w-full py-6 text-lg font-semibold gradient-bg hover:opacity-90 transition-opacity"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}