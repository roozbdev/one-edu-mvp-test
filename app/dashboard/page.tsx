'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser, getUserProfile, signOut } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Sparkles, MessageCircle, Trophy, Target, LogOut, Star, Award } from 'lucide-react'

interface UserProfile {
  id: string
  name: string
  age: number
  interests: string[]
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const loadProfile = async () => {
      try {
        // Check if we're in the browser environment
        if (typeof window === 'undefined') {
          return
        }

        const user = await getCurrentUser()
        if (!user) {
          router.push('/auth')
          return
        }

        const { data } = await getUserProfile(user.id)
        if (data) {
          setProfile(data)
        }
      } catch (error) {
        console.error('Error loading profile:', error)
        if (error instanceof Error && error.message === 'Supabase client not initialized') {
          setError('Configuration error. Please check your environment variables.')
        } else {
          setError('Failed to load profile')
        }
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [router])

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
      if (error instanceof Error && error.message === 'Supabase client not initialized') {
        setError('Configuration error. Please check your environment variables.')
      }
    }
  }

  const skills = [
    { name: 'Communication', level: 3, xp: 420, maxXp: 500, color: 'bg-blue-500' },
    { name: 'Problem Solving', level: 2, xp: 280, maxXp: 400, color: 'bg-green-500' },
    { name: 'Leadership', level: 1, xp: 150, maxXp: 300, color: 'bg-purple-500' },
  ]

  const badges = [
    { name: 'First Chat', description: 'Had your first conversation with Astra', icon: MessageCircle },
    { name: 'Curious Mind', description: 'Asked 10 thoughtful questions', icon: Target },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 space-y-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Welcome back, {profile?.name || 'Learner'}! 🌟
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Ready to continue your learning adventure?
                  </CardDescription>
                </div>
              </div>
              <Button 
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                className="border-purple-200 hover:bg-purple-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow cursor-pointer transform hover:scale-105 transition-transform">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">Chat with Astra</h3>
                  <p className="text-gray-600 text-sm">Continue your conversation</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow cursor-pointer transform hover:scale-105 transition-transform">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">View Progress</h3>
                  <p className="text-gray-600 text-sm">See how you&apos;re growing</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* XP Overview */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span>Your XP Progress</span>
            </CardTitle>
            <CardDescription>
              You&apos;re doing amazing! Keep learning to unlock new skills.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Total XP</span>
                <span className="text-2xl font-bold text-purple-600">850 XP</span>
              </div>
              <Progress value={85} className="h-3" />
              <p className="text-xs text-gray-500 mt-1">150 XP until next level!</p>
            </div>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-500" />
              <span>Your Skills</span>
            </CardTitle>
            <CardDescription>
              Watch your skills grow as you learn with Astra!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {skills.map((skill, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{skill.name}</span>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs">
                        Level {skill.level}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {skill.xp}/{skill.maxXp} XP
                      </span>
                    </div>
                  </div>
                  <Progress value={(skill.xp / skill.maxXp) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Badges */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-yellow-500" />
              <span>Your Achievements</span>
            </CardTitle>
            <CardDescription>
              Celebrate your learning milestones!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {badges.map((badge, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <badge.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{badge.name}</h4>
                    <p className="text-xs text-gray-600">{badge.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Button */}
        <div className="text-center">
          <Button 
            onClick={() => router.push('/chat')}
            className="py-6 px-12 text-lg font-semibold gradient-bg hover:opacity-90 transition-opacity pulse-glow"
          >
            <MessageCircle className="h-6 w-6 mr-2" />
            Chat with Astra
          </Button>
        </div>
      </div>
    </div>
  )
}