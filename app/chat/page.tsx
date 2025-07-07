'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser, getUserProfile } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ArrowLeft, Send, Sparkles, User } from 'lucide-react'

interface Message {
  id: string
  text: string
  sender: 'user' | 'astra'
  timestamp: Date
}

interface UserProfile {
  id: string
  name: string
  age: number
  interests: string[]
}

export default function ChatPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const user = await getCurrentUser()
        if (!user) {
          router.push('/auth')
          return
        }

        const { data } = await getUserProfile(user.id)
        if (data) {
          setProfile(data)
          // Add welcome message
          setMessages([{
            id: '1',
            text: `Hi ${data.name}! 🌟 I'm Astra, your AI mentor. I'm here to help you learn and grow. What would you like to talk about today?`,
            sender: 'astra',
            timestamp: new Date()
          }])
        }
      } catch (error) {
        console.error('Error loading profile:', error)
      }
    }

    loadProfile()
  }, [router])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim() || loading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage.trim(),
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage.trim(),
          childName: profile?.name,
        }),
      })

      const data = await response.json()
      
      const astraMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.reply || "I'm sorry, I didn't understand that. Can you try asking in a different way?",
        sender: 'astra',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, astraMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble thinking right now. Can you try asking me again in a moment?",
        sender: 'astra',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm rounded-none">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-4">
            <Button 
              onClick={() => router.push('/dashboard')}
              variant="outline"
              size="sm"
              className="border-purple-200 hover:bg-purple-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center floating-animation">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Astra
                </CardTitle>
                <p className="text-sm text-gray-600">Your AI Mentor</p>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Chat Area */}
      <div className="flex-1 p-4">
        <Card className="h-full max-w-4xl mx-auto shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-0 h-full flex flex-col">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                        message.sender === 'user'
                          ? 'chat-bubble-user text-white'
                          : 'chat-bubble-astra text-white'
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.sender === 'astra' && (
                          <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <Sparkles className="h-3 w-3 text-white" />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="text-sm leading-relaxed">{message.text}</p>
                          <p className="text-xs opacity-75 mt-1">
                            {message.timestamp.toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>
                        {message.sender === 'user' && (
                          <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <User className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="max-w-[70%] rounded-2xl px-4 py-3 chat-bubble-astra text-white">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                          <Sparkles className="h-3 w-3 text-white" />
                        </div>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="border-t p-4">
              <form onSubmit={sendMessage} className="flex space-x-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your message to Astra..."
                  disabled={loading}
                  className="flex-1 h-12 border-2 border-purple-100 focus:border-purple-300"
                />
                <Button 
                  type="submit" 
                  disabled={loading || !inputMessage.trim()}
                  className="h-12 px-6 gradient-bg hover:opacity-90 transition-opacity"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}