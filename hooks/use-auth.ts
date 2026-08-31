"use client"

import { useEffect, useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

export function useAuth() {
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", user.id)
          .single()
        setProfile(profile)
        setIsAdmin(profile?.user_role === "admin")

        // Fire-and-forget welcome email (idempotent on server)
        fetch("/api/emails/welcome", { method: "POST" }).catch(() => {})
      }
      setIsLoading(false)
    }

    getUser()

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        supabase.from("user_profiles")
          .select("*")
          .eq("id", session.user.id)
          .single()
          .then(({ data }) => {
            setProfile(data)
            setIsAdmin(data?.user_role === "admin")
            fetch("/api/emails/welcome", { method: "POST" }).catch(() => {})
          })
      } else {
        setProfile(null)
        setIsAdmin(false)
      }
      setIsLoading(false)
    })

    return () => {
      data?.subscription.unsubscribe()
    }
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    return { data, error }
  }, [])

  const signUp = useCallback(async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    })
    if (!error && data.user && data.session) {
      await supabase.from("user_profiles").upsert({
        id: data.user.id,
        email: data.user.email!,
        full_name: fullName,
      })
    }
    return { data, error }
  }, [])

  const signInWithGoogle = useCallback(async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    return { data, error }
  }, [])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    setIsAdmin(false)
  }, [])

  const updateProfile = useCallback(async (updates: Partial<any>) => {
    if (!user) return { error: new Error("Not authenticated") }
    const { data, error } = await supabase
      .from("user_profiles")
      .update(updates)
      .eq("id", user.id)
      .select()
      .single()
    if (!error) setProfile(data)
    return { data, error }
  }, [user])

  return {
    user,
    profile,
    isLoading,
    isAuthenticated: !!user,
    isAdmin,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    updateProfile,
  }
}
