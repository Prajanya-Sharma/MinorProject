"use client"

import { useState } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Bell, Lock, Eye } from "lucide-react"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    bookingAlerts: true,
    marketingEmails: false,
    twoFactorAuth: false,
    theme: "dark",
    language: "en",
  })
  const [saved, setSaved] = useState(false)

  const handleToggle = (key: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
    setSaved(false)
  }

  const handleSelectChange = (key: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
    setSaved(false)
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <main className="w-full min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1a2a5a] to-[#0f172a]">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
          <p className="text-white/60">Manage your account preferences and security</p>
        </div>

        {saved && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <p className="text-green-400">Settings saved successfully!</p>
          </div>
        )}

        {/* Notifications Settings */}
        <div className="glass-card p-8 rounded-lg mb-6">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Bell className="w-6 h-6" />
            Notifications
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-white/10 rounded-lg hover:border-white/20 transition">
              <div>
                <p className="text-white font-medium">Email Notifications</p>
                <p className="text-white/60 text-sm">Receive updates about your bookings</p>
              </div>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={() => handleToggle("emailNotifications")}
                className="w-6 h-6 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 border border-white/10 rounded-lg hover:border-white/20 transition">
              <div>
                <p className="text-white font-medium">Booking Alerts</p>
                <p className="text-white/60 text-sm">Get alerted about new reviews on your lots</p>
              </div>
              <input
                type="checkbox"
                checked={settings.bookingAlerts}
                onChange={() => handleToggle("bookingAlerts")}
                className="w-6 h-6 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 border border-white/10 rounded-lg hover:border-white/20 transition">
              <div>
                <p className="text-white font-medium">Marketing Emails</p>
                <p className="text-white/60 text-sm">Receive promotional offers and updates</p>
              </div>
              <input
                type="checkbox"
                checked={settings.marketingEmails}
                onChange={() => handleToggle("marketingEmails")}
                className="w-6 h-6 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="glass-card p-8 rounded-lg mb-6">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Lock className="w-6 h-6" />
            Security
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-white/10 rounded-lg hover:border-white/20 transition">
              <div>
                <p className="text-white font-medium">Two-Factor Authentication</p>
                <p className="text-white/60 text-sm">Add an extra layer of security to your account</p>
              </div>
              <input
                type="checkbox"
                checked={settings.twoFactorAuth}
                onChange={() => handleToggle("twoFactorAuth")}
                className="w-6 h-6 cursor-pointer"
              />
            </div>

            <button className="w-full p-4 border border-white/10 rounded-lg hover:border-blue-400 hover:bg-blue-500/10 transition text-left text-white font-medium">
              Change Password
            </button>
          </div>
        </div>

        {/* Preferences */}
        <div className="glass-card p-8 rounded-lg mb-6">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Eye className="w-6 h-6" />
            Preferences
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-white font-medium mb-2">Theme</label>
              <select
                value={settings.theme}
                onChange={(e) => handleSelectChange("theme", e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400"
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="auto">Auto</option>
              </select>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Language</label>
              <select
                value={settings.language}
                onChange={(e) => handleSelectChange("language", e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex gap-4">
          <button
            onClick={handleSave}
            className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition"
          >
            Save Settings
          </button>
          <button className="px-8 py-3 border border-white/20 text-white font-medium rounded-lg hover:border-white/40 transition">
            Reset to Defaults
          </button>
        </div>
      </div>

      <Footer />
    </main>
  )
}
