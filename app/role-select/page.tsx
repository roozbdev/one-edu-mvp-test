'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser, createUserProfile } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Sparkles, Baby, UserCheck } from 'lucide-react'

export default function RoleSelectPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleRoleSelect = async (role: 'child' | 'parent') => {
    setLoading(true)
    setError('')

    try {
      const user = await getCurrentUser()
      if (!user) {
        router.push('/auth')
        return
      }

      const { error } = await createUserProfile({
        id: user.id,
        email: user.email!,
        role,
      })

      if (error) {
        setError(error.message)
      } else {
        if (role === 'child') {
          router.push('/onboarding')
        } else {
          router.push('/parent')
        }
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center floating-animation">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Who Are You?
          </CardTitle>
          <CardDescription className="text-gray-600">
            Choose your role to get started with Astra
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {error && (
            <Alert className="mb-4 border-red-200 bg-red-50">
              <AlertDescription className="text-red-700">
                {error}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-4">
            <Button
              onClick={() => handleRoleSelect('child')}
              disabled={loading}
              className="w-full p-6 h-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white transition-all duration-300 transform hover:scale-105"
            >
              <div className="flex items-center space-x-3">
                <Baby className="h-8 w-8" />
                <div className="text-left">
                  <div className="font-semibold text-lg">I'm a Kid</div>
                  <div className="text-sm opacity-90">Age 8-13, ready to learn and grow!</div>
                </div>
              </div>
            </Button>
            
            <Button
              onClick={() => handleRoleSelect('parent')}
              disabled={loading}
              variant="outline"
              className="w-full p-6 h-auto border-2 border-purple-200 hover:bg-purple-50 transition-all duration-300 transform hover:scale-105"
            >
              <div className="flex items-center space-x-3">
                <UserCheck className="h-8 w-8 text-purple-600" />
                <div className="text-left">
                  <div className="font-semibold text-lg text-purple-600">I'm a Parent</div>
                  <div className="text-sm text-gray-600">Supporting my child's learning journey</div>
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}