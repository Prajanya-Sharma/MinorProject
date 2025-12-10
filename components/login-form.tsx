"use client"

import type React from "react"
import { useState } from "react"
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "@/lib/auth"

interface FormState {
  email: string
  password: string
  rememberMe: boolean
  isLoading: boolean
  error: string
  validations: {
    email: boolean | null
    password: boolean | null
  }
}

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [formState, setFormState] = useState<FormState>({
    email: "",
    password: "",
    rememberMe: false,
    isLoading: false,
    error: "",
    validations: {
      email: null,
      password: null,
    },
  })
  const router = useRouter()

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password: string): boolean => {
    return password.length >= 6
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target

    setFormState((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      error: "",
      validations: {
        ...prev.validations,
        ...(name === "email" && { email: value ? validateEmail(value) : null }),
        ...(name === "password" && { password: value ? validatePassword(value) : null }),
      },
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const emailValid = validateEmail(formState.email)
    const passwordValid = validatePassword(formState.password)

    if (!emailValid || !passwordValid) {
      setFormState((prev) => ({
        ...prev,
        validations: { email: emailValid, password: passwordValid },
        error: "Please enter a valid email and password",
      }))
      return
    }

    setFormState((prev) => ({ ...prev, isLoading: true }))

    try {
      await signIn(formState.email, formState.password)
      setFormState((prev) => ({
        ...prev,
        isLoading: false,
        error: "",
      }))
      router.push("/dashboard")
    } catch (err: any) {
      setFormState((prev) => ({
        ...prev,
        isLoading: false,
        error: err.message || "Login failed. Please try again.",
      }))
    }
  }

  return (
    <div className="space-y-6">
      {formState.error && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="glass-card border-red-500/50 bg-red-500/10 px-4 py-3">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-500" />
              <p className="text-sm text-red-200">{formState.error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="glass-card space-y-6 rounded-2xl px-6 py-8 sm:px-8">
        {/* Header */}
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
          <p className="text-sm text-gray-300">Sign in to your SmartParking account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-200">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formState.email}
                onChange={handleInputChange}
                className={`w-full rounded-lg border bg-white/5 px-4 py-2.5 pl-10 text-white placeholder-gray-500 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-0 ${
                  formState.validations.email === true
                    ? "border-green-500/50 focus:border-green-500 focus:ring-green-500/50"
                    : formState.validations.email === false
                      ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/50"
                      : "border-white/20 focus:border-blue-500/50 focus:ring-blue-500/50"
                }`}
              />
              {formState.validations.email === true && (
                <CheckCircle2 className="absolute right-3 top-3 h-5 w-5 text-green-500" />
              )}
              {formState.validations.email === false && (
                <AlertCircle className="absolute right-3 top-3 h-5 w-5 text-red-500" />
              )}
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-200">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formState.password}
                onChange={handleInputChange}
                className={`w-full rounded-lg border bg-white/5 px-4 py-2.5 pl-10 pr-10 text-white placeholder-gray-500 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-0 ${
                  formState.validations.password === true
                    ? "border-green-500/50 focus:border-green-500 focus:ring-green-500/50"
                    : formState.validations.password === false
                      ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/50"
                      : "border-white/20 focus:border-blue-500/50 focus:ring-blue-500/50"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-300 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
              {formState.validations.password === true && (
                <CheckCircle2 className="absolute right-10 top-3 h-5 w-5 text-green-500" />
              )}
              {formState.validations.password === false && (
                <AlertCircle className="absolute right-10 top-3 h-5 w-5 text-red-500" />
              )}
            </div>
          </div>

          {/* Remember & Forgot */}
          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formState.rememberMe}
                onChange={handleInputChange}
                className="h-4 w-4 rounded border-white/20 bg-white/5 accent-blue-500 cursor-pointer"
              />
              <span className="text-sm text-gray-300">Remember me</span>
            </label>
            <Link href="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
              Forgot Password?
            </Link>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={formState.isLoading}
            className={`w-full rounded-lg px-4 py-2.5 font-semibold text-white transition-all duration-300 ${
              formState.isLoading
                ? "bg-blue-500/50 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/50 active:scale-95"
            }`}
          >
            {formState.isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Signing in...</span>
              </div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-gray-500">Or</span>
          </div>
        </div>

        {/* Sign Up Link */}
        <p className="text-center text-sm text-gray-300">
          Don't have an account?{" "}
          <Link href="/signup" className="text-blue-400 hover:text-blue-300 transition-colors font-medium underline">
            Sign Up
          </Link>
        </p>
      </div>

      {/* Footer Links */}
      <div className="flex justify-center gap-6 text-xs text-gray-400">
        <Link href="#" className="hover:text-gray-300 transition-colors">
          Privacy Policy
        </Link>
        <Link href="#" className="hover:text-gray-300 transition-colors">
          Terms of Service
        </Link>
      </div>
    </div>
  )
}
