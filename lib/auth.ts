import { createClient } from "@/lib/supabase/client"

export const signUp = async (email: string, password: string, fullName: string) => {
  const supabase = createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  })

  if (error) throw new Error(error.message)
  return data
}

export const signIn = async (email: string, password: string) => {
  const supabase = createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw new Error(error.message)
  return data
}

export const signOut = async () => {
  const supabase = createClient()

  const { error } = await supabase.auth.signOut()

  if (error) throw new Error(error.message)
}
