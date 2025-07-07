'use client'
import { supabase } from './supabase'

export interface UserProfile {
  id: string
  email: string
  role: 'child' | 'parent'
  name?: string
  age?: number
  interests?: string[]
  created_at: string
}

export const signUp = async (email: string, password: string) => {
  if (!supabase) {
    throw new Error('Supabase client not initialized')
  }
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  return { data, error }
}

export const signIn = async (email: string, password: string) => {
  if (!supabase) {
    throw new Error('Supabase client not initialized')
  }
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signOut = async () => {
  if (!supabase) {
    throw new Error('Supabase client not initialized')
  }
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  if (!supabase) {
    throw new Error('Supabase client not initialized')
  }
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export const createUserProfile = async (profile: Partial<UserProfile>) => {
  if (!supabase) {
    throw new Error('Supabase client not initialized')
  }
  const { data, error } = await supabase
    .from('profiles')
    .insert([profile])
    .select()
    .single()
  
  return { data, error }
}

export const getUserProfile = async (userId: string) => {
  if (!supabase) {
    throw new Error('Supabase client not initialized')
  }
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  return { data, error }
}

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
  if (!supabase) {
    throw new Error('Supabase client not initialized')
  }
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  
  return { data, error }
}