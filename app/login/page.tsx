import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-background font-sans">
      <div className="fixed inset-0 -z-20 bg-gradient-to-br from-[#0f172a] via-[#1a2a5a] to-[#0f172a]" />

      {/* Subtle animated gradient overlay */}
      <div className="fixed inset-0 -z-10 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-purple-500/10 animate-pulse" />
      </div>

      {/* Centered login card */}
      <div className="flex min-h-screen items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </main>
  )
}
