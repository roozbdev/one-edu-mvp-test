'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser, updateUserProfile } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Sparkles, ArrowRight } from 'lucide-react'

export default function OnboardingPage() {
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [interests, setInterests] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const user = await getCurrentUser()
      if (!user) {
        router.push('/auth')
        return
      }

      const interestsList = interests.split(',').map(i => i.trim()).filter(i => i)
      
      const { error } = await updateUserProfile(user.id, {
        name,
        age: parseInt(age),
        interests: interestsList,
      })

      if (error) {
        setError(error.message)
      } else {
        router.push('/dashboard')
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
            Let's Get to Know You!
          </CardTitle>
          <CardDescription className="text-gray-600">
            Tell Astra a bit about yourself so she can help you better
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
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">What's your name?</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-12"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="age">How old are you?</Label>
              <Select value={age} onValueChange={setAge} required>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select your age" />
                </SelectTrigger>
                <SelectContent>
                  {[8, 9, 10, 11, 12, 13].map((ageValue) => (
                    <SelectItem key={ageValue} value={ageValue.toString()}>
                      {ageValue} years old
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="interests">What do you love doing?</Label>
              <Input
                id="interests"
                type="text"
                placeholder="e.g., reading, sports, art, music"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                className="h-12"
              />
              <p className="text-sm text-gray-500">
                Separate multiple interests with commas
              </p>
            </div>
            
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full py-6 text-lg font-semibold gradient-bg hover:opacity-90 transition-opacity"
            >
              {loading ? 'Loading...' : (
                <div className="flex items-center justify-center space-x-2">
                  <span>Start My Journey</span>
                  <ArrowRight className="h-5 w-5" />
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}