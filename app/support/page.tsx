"use client"

import type React from "react"

import { useState } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { ChevronDown, Mail, MessageSquare, HelpCircle } from "lucide-react"

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: "How do I create a parking lot?",
    answer:
      "Go to 'Add Lot' in the navigation menu, fill in your parking lot details including location, pricing, and amenities, then submit. Your lot will appear in the browse section immediately.",
  },
  {
    question: "How do I book a parking spot?",
    answer:
      "Browse available lots using the 'Browse Lots' page, select a lot you like, choose your parking dates and times, and complete the booking form. You'll receive a confirmation email with your booking details.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We currently accept all major credit cards (Visa, Mastercard, American Express) and digital payment methods. Payment is processed securely through our platform.",
  },
  {
    question: "Can I cancel my booking?",
    answer:
      "Yes, you can cancel bookings from your 'My Bookings' page. Cancellations made 24 hours before the parking start time receive a full refund.",
  },
  {
    question: "How do I earn money from my parking lot?",
    answer:
      "List your parking lot on SmartParking and set your hourly rates. You earn money each time someone books your lot. Payments are processed weekly to your account.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes, we use industry-standard encryption and security protocols to protect your personal and payment information. Your data is never shared with third parties.",
  },
]

export default function SupportPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setContactForm({ name: "", email: "", subject: "", message: "" })
      setSubmitted(false)
    }, 3000)
  }

  return (
    <main className="w-full min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1a2a5a] to-[#0f172a]">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Help & Support</h1>
          <p className="text-white/60 text-lg">Find answers and get support when you need it</p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="glass-card p-6 rounded-lg text-center hover:border-blue-400/50 transition">
            <Mail className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <h3 className="text-white font-semibold mb-2">Email Support</h3>
            <p className="text-white/60 text-sm mb-4">support@smartparking.com</p>
            <a href="mailto:support@smartparking.com" className="text-blue-400 hover:text-blue-300 text-sm font-medium">
              Send Email
            </a>
          </div>

          <div className="glass-card p-6 rounded-lg text-center hover:border-blue-400/50 transition">
            <MessageSquare className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <h3 className="text-white font-semibold mb-2">Live Chat</h3>
            <p className="text-white/60 text-sm mb-4">Available 9 AM - 6 PM EST</p>
            <button className="text-green-400 hover:text-green-300 text-sm font-medium">Start Chat</button>
          </div>

          <div className="glass-card p-6 rounded-lg text-center hover:border-blue-400/50 transition">
            <HelpCircle className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <h3 className="text-white font-semibold mb-2">Documentation</h3>
            <p className="text-white/60 text-sm mb-4">Read our guides and tutorials</p>
            <a href="#" className="text-purple-400 hover:text-purple-300 text-sm font-medium">
              View Docs
            </a>
          </div>
        </div>

        {/* FAQs */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="glass-card rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition"
                >
                  <p className="text-white font-medium text-left">{faq.question}</p>
                  <ChevronDown
                    className={`w-5 h-5 text-blue-400 transition transform ${openIndex === index ? "rotate-180" : ""}`}
                  />
                </button>

                {openIndex === index && (
                  <div className="px-6 py-4 border-t border-white/10 bg-white/5">
                    <p className="text-white/70 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="glass-card p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-white mb-6">Can't Find Your Answer?</h2>

          {submitted && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <p className="text-green-400">Thank you! We'll get back to you soon.</p>
            </div>
          )}

          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Your Name"
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-blue-400"
                required
              />
              <input
                type="email"
                placeholder="Your Email"
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-blue-400"
                required
              />
            </div>

            <input
              type="text"
              placeholder="Subject"
              value={contactForm.subject}
              onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-blue-400"
              required
            />

            <textarea
              placeholder="Your message..."
              value={contactForm.message}
              onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
              rows={5}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-blue-400 resize-none"
              required
            />

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </main>
  )
}
