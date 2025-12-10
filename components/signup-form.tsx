"use client"

import type React from "react"
import { useState } from "react"
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signUp } from "@/lib/auth"

interface FormState {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  agreeTerms: boolean
  isLoading: boolean
  error: string
  validations: {
    fullName: boolean | null
    email: boolean | null
    password: boolean | null
    confirmPassword: boolean | null
    agreeTerms: boolean | null
  }
}

interface PasswordStrength {
  score: number
  label: string
  color: string
  requirements: {
    minLength: boolean
    uppercase: boolean
    number: boolean
    specialChar: boolean
  }
}

export function SignupForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()
  const [formState, setFormState] = useState<FormState>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
    isLoading: false,
    error: "",
    validations: {
      fullName: null,
      email: null,
      password: null,
      confirmPassword: null,
      agreeTerms: null,
    },
  })

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateFullName = (name: string): boolean => {
    return name.trim().length >= 2
  }

  const calculatePasswordStrength = (password: string): PasswordStrength => {
    const requirements = {
      minLength: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
    }

    let score = 0
    if (requirements.minLength) score++
    if (requirements.uppercase) score++
    if (requirements.number) score++
    if (requirements.specialChar) score++

    const strengthMap = {
      0: { label: "Weak", color: "bg-red-500" },
      1: { label: "Weak", color: "bg-red-500" },
      2: { label: "Fair", color: "bg-yellow-500" },
      3: { label: "Strong", color: "bg-green-500" },
      4: { label: "Strong", color: "bg-green-500" },
    }

    return {
      score,
      label: strengthMap[score as keyof typeof strengthMap].label,
      color: strengthMap[score as keyof typeof strengthMap].color,
      requirements,
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target

    setFormState((prev) => {
      const updates: Partial<FormState> = {
        [name]: type === "checkbox" ? checked : value,
        error: "",
      }

      const newValidations = { ...prev.validations }

      if (name === "fullName") {
        newValidations.fullName = value ? validateFullName(value) : null
      }
      if (name === "email") {
        newValidations.email = value ? validateEmail(value) : null
      }
      if (name === "password") {
        newValidations.password = value ? calculatePasswordStrength(value).score === 4 : null
      }
      if (name === "confirmPassword") {
        newValidations.confirmPassword = value && prev.password ? value === prev.password : null
      }
      if (name === "agreeTerms") {
        newValidations.agreeTerms = checked ? true : null
      }

      return {
        ...prev,
        ...updates,
        validations: newValidations,
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const fullNameValid = validateFullName(formState.fullName)
    const emailValid = validateEmail(formState.email)
    const passwordStrength = calculatePasswordStrength(formState.password)
    const passwordValid = passwordStrength.score === 4
    const confirmPasswordValid = formState.password === formState.confirmPassword
    const agreeTermsValid = formState.agreeTerms

    if (!fullNameValid || !emailValid || !passwordValid || !confirmPasswordValid || !agreeTermsValid) {
      setFormState((prev) => ({
        ...prev,
        validations: {
          fullName: fullNameValid,
          email: emailValid,
          password: passwordValid,
          confirmPassword: confirmPasswordValid,
          agreeTerms: agreeTermsValid,
        },
        error: "Please fill in all fields correctly and agree to terms",
      }))
      return
    }

    setFormState((prev) => ({ ...prev, isLoading: true }))

    try {
      await signUp(formState.email, formState.password, formState.fullName)
      setFormState((prev) => ({
        ...prev,
        isLoading: false,
        error: "",
      }))
      // Show success message and redirect to login
      router.push("/login?message=Check your email to confirm your account")
    } catch (err: any) {
      setFormState((prev) => ({
        ...prev,
        isLoading: false,
        error: err.message || "Signup failed. Please try again.",
      }))
    }
  }

  const passwordStrength = calculatePasswordStrength(formState.password)

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
          <h1 className="text-3xl font-bold text-white">Create Account</h1>
          <p className="text-sm text-gray-300">Join SmartParking and start parking smarter</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name Input */}
          <div className="space-y-2">
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-200">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="John Doe"
                value={formState.fullName}
                onChange={handleInputChange}
                className={`w-full rounded-lg border bg-white/5 px-4 py-2.5 pl-10 text-white placeholder-gray-500 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-0 ${
                  formState.validations.fullName === true
                    ? "border-green-500/50 focus:border-green-500 focus:ring-green-500/50"
                    : formState.validations.fullName === false
                      ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/50"
                      : "border-white/20 focus:border-blue-500/50 focus:ring-blue-500/50"
                }`}
              />
              {formState.validations.fullName === true && (
                <CheckCircle2 className="absolute right-3 top-3 h-5 w-5 text-green-500" />
              )}
              {formState.validations.fullName === false && (
                <AlertCircle className="absolute right-3 top-3 h-5 w-5 text-red-500" />
              )}
            </div>
          </div>

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
            </div>

            {/* Password Strength Meter */}
            {formState.password && (
              <div className="space-y-2 pt-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all ${
                        i <= passwordStrength.score ? passwordStrength.color : "bg-gray-600"
                      }`}
                    />
                  ))}
                </div>
                <p
                  className={`text-xs font-medium ${
                    passwordStrength.label === "Strong"
                      ? "text-green-400"
                      : passwordStrength.label === "Fair"
                        ? "text-yellow-400"
                        : "text-red-400"
                  }`}
                >
                  Strength: {passwordStrength.label}
                </p>

                {/* Password Requirements */}
                <div className="space-y-1 pt-2">
                  <p className="text-xs text-gray-400">Requirements:</p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      {passwordStrength.requirements.minLength ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <div className="h-3.5 w-3.5 rounded-full border border-gray-500" />
                      )}
                      <span className={passwordStrength.requirements.minLength ? "text-green-400" : "text-gray-400"}>
                        8+ characters
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      {passwordStrength.requirements.uppercase ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <div className="h-3.5 w-3.5 rounded-full border border-gray-500" />
                      )}
                      <span className={passwordStrength.requirements.uppercase ? "text-green-400" : "text-gray-400"}>
                        1 uppercase letter
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      {passwordStrength.requirements.number ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <div className="h-3.5 w-3.5 rounded-full border border-gray-500" />
                      )}
                      <span className={passwordStrength.requirements.number ? "text-green-400" : "text-gray-400"}>
                        1 number
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      {passwordStrength.requirements.specialChar ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <div className="h-3.5 w-3.5 rounded-full border border-gray-500" />
                      )}
                      <span className={passwordStrength.requirements.specialChar ? "text-green-400" : "text-gray-400"}>
                        1 special character
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password Input */}
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formState.confirmPassword}
                onChange={handleInputChange}
                className={`w-full rounded-lg border bg-white/5 px-4 py-2.5 pl-10 pr-10 text-white placeholder-gray-500 backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-0 ${
                  formState.validations.confirmPassword === true
                    ? "border-green-500/50 focus:border-green-500 focus:ring-green-500/50"
                    : formState.validations.confirmPassword === false
                      ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/50"
                      : "border-white/20 focus:border-blue-500/50 focus:ring-blue-500/50"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-300 transition-colors"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
              {formState.validations.confirmPassword === true && (
                <CheckCircle2 className="absolute right-10 top-3 h-5 w-5 text-green-500" />
              )}
              {formState.validations.confirmPassword === false && (
                <AlertCircle className="absolute right-10 top-3 h-5 w-5 text-red-500" />
              )}
            </div>
          </div>

          {/* Terms Checkbox */}
          <label className="flex items-start gap-3 cursor-pointer pt-2">
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formState.agreeTerms}
              onChange={handleInputChange}
              className="mt-1 h-4 w-4 rounded border-white/20 bg-white/5 accent-blue-500 cursor-pointer"
            />
            <span className="text-sm text-gray-300">
              I agree to the{" "}
              <Link href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                Terms & Conditions
              </Link>
            </span>
          </label>

          {/* Create Account Button */}
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
                <span>Creating Account...</span>
              </div>
            ) : (
              "Create Account"
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

        {/* Sign In Link */}
        <p className="text-center text-sm text-gray-300">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-400 hover:text-blue-300 transition-colors font-medium underline">
            Sign In
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
