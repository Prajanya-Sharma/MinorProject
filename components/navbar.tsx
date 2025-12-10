"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { signOut } from "@/lib/auth"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const router = useRouter()

  // Fetch current user on component mount
  useEffect(() => {
    const fetchUser = async () => {
      // Skip auth check on landing page
      if (pathname === "/") {
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch("/api/auth/me")
        if (response.ok) {
          const { user } = await response.json()
          setUser(user)
        }
      } catch (error) {
        console.error("Failed to fetch user:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [pathname])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Handle logout with Supabase
  const handleLogout = async () => {
    try {
      await signOut()
      setUser(null)
      setIsDropdownOpen(false)
      router.push("/login")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const navLinks = [
    { href: "/browse", label: "Browse Lots" },
    { href: "/my-bookings", label: "My Bookings" },
    { href: "/my-lots", label: "My Lots" },
    { href: "/add-lot", label: "Add Lot" },
    { href: "/support", label: "Support" },
  ]

  const isActive = (href: string) => pathname === href
  const userInitial = user?.user_metadata?.full_name?.[0] || user?.email?.[0] || "U"
  const userEmail = user?.email || "guest@example.com"
  const userName = user?.user_metadata?.full_name || "User"

  return (
    <nav className="glass-navbar sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <span className="text-xl font-bold text-white hidden sm:inline">SmartParking</span>
          </Link>

          {/* Center: Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-sm font-medium transition-colors duration-300 group ${
                  isActive(link.href) ? "text-blue-400" : "text-gray-300 hover:text-blue-400"
                }`}
              >
                {link.label}
                <span
                  className={`absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full ${
                    isActive(link.href) ? "w-full" : ""
                  }`}
                />
              </Link>
            ))}
          </div>

          {/* Right: Search, User Avatar & Menu */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="hidden sm:flex items-center justify-center w-10 h-10 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Search parking lots"
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold hover:ring-2 hover:ring-blue-300 transition-all duration-300"
                aria-label="User menu"
              >
                {userInitial}
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 glass-card rounded-lg shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-sm font-medium text-white">{userName}</p>
                    <p className="text-xs text-gray-400">{userEmail}</p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-300 hover:text-blue-400 hover:bg-white/10 transition-all duration-200"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-sm text-gray-300 hover:text-blue-400 hover:bg-white/10 transition-all duration-200"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Settings
                    </Link>
                    <Link
                      href="/my-bookings"
                      className="block px-4 py-2 text-sm text-gray-300 hover:text-blue-400 hover:bg-white/10 transition-all duration-200"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      My Bookings
                    </Link>
                    <Link
                      href="/my-lots"
                      className="block px-4 py-2 text-sm text-gray-300 hover:text-blue-400 hover:bg-white/10 transition-all duration-200"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      My Lots
                    </Link>
                    <Link
                      href="/add-lot"
                      className="block px-4 py-2 text-sm text-gray-300 hover:text-blue-400 hover:bg-white/10 transition-all duration-200"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Add Lot
                    </Link>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-white/10"></div>

                  {/* Logout */}
                  <div className="py-2">
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-white/10 transition-all duration-200 rounded"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12M6 12h12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden pb-4 space-y-2 animate-in slide-in-from-top duration-300">
            {/* Mobile Navigation Links */}
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.href)
                    ? "bg-blue-500/20 text-blue-400 border border-blue-400/30"
                    : "text-gray-300 hover:bg-white/10 hover:text-blue-400"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile User Menu */}
            <div className="border-t border-white/10 pt-2 mt-2">
              <Link
                href="/profile"
                className="block px-4 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/10 hover:text-blue-400 transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Link>
              <Link
                href="/settings"
                className="block px-4 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/10 hover:text-blue-400 transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Settings
              </Link>
              <button
                className="w-full text-left px-4 py-2 rounded-lg text-sm text-red-400 hover:bg-white/10 hover:text-red-300 transition-all duration-200"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
