"use client"

import { useState, useEffect, useCallback, useRef, memo } from "react"
import Link from "next/link"
import { Plus, DollarSign, Bitcoin, X } from "lucide-react"
import InteractiveCard from "@/components/interactive-card"
import GameOfLife from "@/components/game-of-life"
import CompatibleChains from "@/components/compatible-chains"
import { useIsMobile } from "@/hooks/use-mobile"
import { supabase } from "@/lib/supabase"

// Utility function for debouncing
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Accordion Item component
const AccordionItem = memo(
  ({
    index,
    title,
    content,
    isOpen,
    onToggle,
  }: {
    index: number
    title: string
    content: string
    isOpen: boolean
    onToggle: (index: number) => void
  }) => (
    <div className="border border-black p-4 lg:p-6 mb-4 last:mb-0">
      <div className="flex justify-between items-center cursor-pointer" onClick={() => onToggle(index)}>
        <h3 className="text-base lg:text-lg">{title}</h3>
        <button
          className="w-6 h-6 rounded-full border border-black flex items-center justify-center"
          aria-label={isOpen ? "Collapse" : "Expand"}
        >
          {isOpen ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </button>
      </div>
      {isOpen && (
        <div className="mt-4">
          <p className="text-xs lg:text-sm">{content}</p>
        </div>
      )}
    </div>
  ),
)

AccordionItem.displayName = "AccordionItem"

// Navigation Dots component - simplified to null since it's not being used
const NavigationDots = memo(() => null)
NavigationDots.displayName = "NavigationDots"

// Main component
export default function Home() {
  // Constants
  const TOTAL_SECTIONS = 4

  // State
  const [openAccordion, setOpenAccordion] = useState<number | null>(0)
  const [activeTab, setActiveTab] = useState("individuals")
  const [hasTabSwitched, setHasTabSwitched] = useState(false)
  const [activeSection, setActiveSection] = useState(0)
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [alreadyJoined, setAlreadyJoined] = useState(false)
  const [showAppTooltip, setShowAppTooltip] = useState(false)

  // Refs
  const sectionsRef = useRef<(HTMLElement | null)[]>([])

  // Hooks
  const isMobile = useIsMobile()

  // Initialize grid only once
  const initializeGrid = useCallback(() => {
    return Array(12)
      .fill(null)
      .map(() =>
        Array(12)
          .fill(null)
          .map(() => Math.random() > 0.7),
      )
  }, [])

  // Setup intersection observer to detect active section
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "-50% 0px", // Consider element in view when it's 50% visible
      threshold: 0,
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = sectionsRef.current.findIndex((section) => section === entry.target)
          if (index !== -1) {
            setActiveSection(index)
          }
        }
      })
    }, options)

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section)
    })

    return () => {
      sectionsRef.current.forEach((section) => {
        if (section) observer.unobserve(section)
      })
    }
  }, [])
  // Update body and header classes based on active section
  useEffect(() => {
    const body = document.body
    const header = document.querySelector("header")

    if (activeSection === 2) {
      body.classList.add("dark-section-active")
      header?.classList.add("text-white")
    } else {
      body.classList.remove("dark-section-active")
      header?.classList.remove("text-white")
    }
  }, [activeSection])

  // Centralized tab switching function
  const switchTab = useCallback((tab: string) => {
    setActiveTab(tab)
    setHasTabSwitched(true)
  }, [])

  // Accordion toggle handler
  const toggleAccordion = useCallback((index: number) => {
    setOpenAccordion((prev) => (prev === index ? null : index))
  }, [])

  useEffect(() => {
    if (submitSuccess || alreadyJoined) {
      const timer = setTimeout(() => {
        setSubmitSuccess(false)
        setAlreadyJoined(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [submitSuccess, alreadyJoined])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)
    setAlreadyJoined(false)

    try {
      // First check if email exists
      const { data: existingEmails } = await supabase
        .from('waitlist')
        .select('email')
        .eq('email', email)
        .limit(1)

      if (existingEmails && existingEmails.length > 0) {
        setAlreadyJoined(true)
        setIsSubmitting(false)
        return
      }

      // If email doesn't exist, insert it
      const { error } = await supabase
        .from('waitlist')
        .insert([{ email, created_at: new Date().toISOString() }])

      if (error) throw error

      setSubmitSuccess(true)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Failed to submit email")
      setSubmitSuccess(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="">
      {/* Hero Section */}
      <section ref={(el) => (sectionsRef.current[0] = el)} className="min-h-screen w-full flex items-center">
        <div className="w-full pt-16 lg:pt-24 px-6 lg:px-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row">
              {/* Content column */}
              <div className="order-2 lg:order-1 bg-[rgb(235, 233, 228)] p-6 lg:p-16 flex-1 min-h-[300px] lg:min-h-[600px] flex flex-col justify-center">
                {/* Game of Life for mobile - positioned above hero text */}
                {isMobile && (
                  <div className="mb-6 max-w-xl mx-auto w-full">
                    <GameOfLife onReset={initializeGrid} isMobile={true} isVisible={activeSection === 0} />
                  </div>
                )}

                <div className="max-w-xl mx-auto w-full">
                  <h1 className="text-4xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-serif mb-3 lg:mb-6 tracking-normal">
                    <span className="block font-serif">The Best Yields, <span className="!text-yellow-600">Guaranteed.</span></span>
                    <div className="text-[var(--foreground)] mt-6 w-full max-w-md">
                      <span className="block text-[14px] sm:text-[14px] md:text-[14px] lg:text-[16px] font-karla tracking-normal leading-5 sm:leading-6 md:leading-6">
                      Unison is a cross-chain yield platform offering one-click deposits and an intuitive interface to access optimized vaults or create custom strategies across multiple blockchains.</span>
                      {/* <div className="h-px w-32 bg-gradient-to-r from-yellow-500 to-transparent border-0 dark:bg-gray-700"></div> */}
                    </div>
                  </h1>

                  <form onSubmit={handleSubmit} className="relative mt-8 max-w-md">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="w-full px-4 py-3 text-sm border border-black/30 rounded-md focus:outline-none focus:ring-2 focus:ring-black/50"
                      disabled={isSubmitting}
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting || submitSuccess || alreadyJoined}
                      className={`mt-4 w-full border border-gray-500/50 h-[42px] lg:h-[45px] ${submitSuccess || alreadyJoined
                        ? "bg-gradient-to-r from-red-500 to-orange-500"
                        : "bg-gradient-to-bl from-zinc-700 to-zinc-900 hover:from-zinc-900 hover:to-zinc-700"
                        } text-white px-6 py-3 rounded-md text-sm font-medium transition-opacity ${(isSubmitting || submitSuccess || alreadyJoined) ? "opacity-100 cursor-not-allowed" : "hover:opacity-100"
                        }`}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Joining...
                        </span>
                      ) : alreadyJoined ? (
                        "Already Joined"
                      ) : submitSuccess ? (
                        "Joined"
                      ) : (
                        "JOIN WAITLIST"
                      )}
                    </button>

                  </form>

                  <div className="-mt-4 max-w-md sm:mt-0">
                    <CompatibleChains />
                  </div>
                </div>
              </div>

              {/* Game of Life for desktop - only show on larger screens */}
              {!isMobile && (
                <div className="order-1 lg:order-2 bg-transparent flex-1 flex items-center justify-center p-6 lg:p-16 min-h-[300px] lg:min-h-[600px] overflow-hidden">
                  <GameOfLife onReset={initializeGrid} isVisible={activeSection === 0} />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Vaults Section */}
      <section
        ref={(el) => (sectionsRef.current[3] = el)}
        className="w-full flex items-center bg-[var(--background)]"
      >
        <div className="w-full py-12 lg:py-16 px-6 lg:px-16">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <div className="mb-1 text-sm uppercase" style={{ color: "var(--foreground)", transition: "none" }}>
                PUBLIC VAULTS
              </div>
              <div className="w-[110px] h-px bg-gradient-to-r from-[var(--decor)] to-transparent mb-4"></div>
            </div>

            {/* Content area with heading and cards side by side */}
            <div className="flex flex-col lg:flex-row items-start gap-8">
              {/* Left column with subheading */}
              <div className="lg:w-1/3 mb-8 lg:mb-0">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif leading-tight text-[var(--foreground)]">
                  Best in class yield,<br /> at scale.
                </h2>
              </div>

              {/* Right column with vault cards */}
              <div className="lg:w-2/3 w-full">
                {/* Modified grid for mobile to make cards take full width */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mx-0">
                  {/* Stables Card */}
                  <InteractiveCard
                    className="interactive-card p-4 relative flex flex-col justify-between h-[170px] w-full mx-0 rounded-3xl bg-gradient-to-tl from-zinc-700 to-zinc-900"
                    style={{
                      boxShadow: "none",
                      borderRadius: "5px",
                      border: "1px solid rgba(0,0,0,0.1)",
                    }}
                  >
                    <div>
                      <div className="text-white text-lg sm:text-xl md:text-2xl font-serif mb-1">
                        Stables
                      </div>
                      <div className="!text-white text-xl sm:text-2xl md:text-3xl font-bold mb-0 tracking-tight mt-6">
                        13 — 18%<sup className="opacity-50">*</sup>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <DollarSign
                        strokeWidth={1.25}
                        className="w-12 h-12 text-stone-100 opacity-20"
                      />
                    </div>
                  </InteractiveCard>

                  {/* Ethereum Card */}
                  <InteractiveCard
                    className="interactive-card p-4 relative flex flex-col justify-between h-[170px] w-full mx-0 bg-gradient-to-tr from-zinc-700 to-zinc-900"
                    style={{
                      boxShadow: "none",
                      borderRadius: "5px",
                      border: "1px solid rgba(0,0,0,0.1)",
                    }}
                  >
                    <div>
                      <div className="text-white text-lg sm:text-xl md:text-2xl font-serif mb-1">
                        Ethereum
                      </div>
                      <div className="!text-white text-xl sm:text-2xl md:text-3xl font-bold mb-0 tracking-tight mt-6">
                        8 — 12%<sup className="opacity-50">*</sup>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-12 h-12 text-white opacity-20"
                      >
                        <path d="M12 2L4 12.5L12 16" />
                        <path d="M12 2L20 12.5L12 16" />
                        <path d="M4 12.5L12 22L20 12.5" />
                        <path d="M12 16L12 22" />
                      </svg>
                    </div>
                  </InteractiveCard>

                  {/* Bitcoin Card */}
                  <InteractiveCard
                    className="interactive-card p-4 relative flex flex-col justify-between h-[170px] w-full mx-0 bg-gradient-to-bl from-zinc-700 to-zinc-900"
                    style={{
                      backgroundColor: "#f2b035",
                      boxShadow: "none",
                      borderRadius: "5px",
                      border: "1px solid rgba(0,0,0,0.1)",
                    }}
                  >
                    <div>
                      <div className="text-white text-lg sm:text-xl md:text-2xl font-serif mb-1">
                        Bitcoin
                      </div>
                      <div className="!text-white text-xl sm:text-2xl md:text-3xl font-bold mb-0 tracking-tight mt-6">
                        2 — 5%<sup className="opacity-50">*</sup>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Bitcoin className="w-12 h-12 text-stone-100 opacity-20"
                        strokeWidth={1.25}
                      />
                    </div>
                  </InteractiveCard>

                  {/* Your Favorite Assets Card */}
                  <InteractiveCard
                    className="interactive-card p-4 relative flex flex-col justify-between h-[170px] w-full mx-0 bg-gradient-to-br from-zinc-700 to-zinc-900"
                    style={{
                      backgroundColor: "var(--card-bg)",
                      boxShadow: "none",
                      borderRadius: "5px",
                      border: "1px solid rgba(0,0,0,0.1)",
                    }}
                  >
                    <div className="flex flex-col justify-between h-full">
                      <div className="text-white text-2xl sm:text-3xl md:text-4xl font-serif">
                        Your Own Vaults
                      </div>
                      <div className="flex justify-end">
                        <Plus className="w-6 h-6 text-white opacity-100" />
                      </div>
                    </div>
                  </InteractiveCard>
                </div>
                <div className="w-full mt-4 p-2">
                  <p className="text-xs text-right text-white/30">*Yields can vary based on market conditions.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section
        ref={(el) => {
          sectionsRef.current[1] = el
          if (el) el.setAttribute("data-section", "benefits")
        }}
        className="w-full flex items-center bg-[var(--background)]"
        style={{ color: "var(--foreground)" }}
      >
        <div className="w-full py-12 lg:py-16 px-6 lg:px-16">
          <div className="max-w-6xl mx-auto">
            <div className="mb-2 text-sm uppercase">FEATURES</div>
            <div className="w-16 h-px bg-gradient-to-r from-[var(--decor)] to-transparent mb-6"></div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-10 lg:mb-16">
              Providing you with the best of DeFi
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div>
                <div
                  className="border border-black/50 w-12 h-12 lg:w-14 lg:h-14 flex items-center justify-center mb-4 lg:mb-6 rounded-lg"
                  style={{ backgroundColor: "var(--button-bg)" }}
                  data-dark-bg="beige"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="svg-icon"
                    aria-hidden="true"
                  >
                    <path d="M10 20H30" stroke="var(--beige)" strokeWidth="1.5" />
                    <path d="M15 10L25 30" stroke="var(--beige)" strokeWidth="1.5" />
                    <path d="M25 10L15 30" stroke="var(--beige)" strokeWidth="1.5" />
                  </svg>
                </div>
                <h3
                  className="text-2xl lg:text-3xl font-serif mb-3 lg:mb-4"
                  style={{ color: "var(--foreground)", transition: "none" }}
                >
                  Omni-Chain
                </h3>
                <p className="text-sm lg:text-base" style={{ color: "var(--foreground)", transition: "none" }}>
                  Deposit from any chain and seamlessly earn the best yield optimized across chains.
                </p>
              </div>

              <div>
                <div
                  className="border border-black/50 w-12 h-12 lg:w-14 lg:h-14 flex items-center justify-center mb-4 lg:mb-6 rounded-lg"
                  style={{ backgroundColor: "var(--button-bg)" }}
                  data-dark-bg="beige"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="svg-icon"
                    aria-hidden="true"
                  >
                    <path d="M20 10V30" stroke="var(--beige)" strokeWidth="1.5" />
                    <path d="M10 20H30" stroke="var(--beige)" strokeWidth="1.5" />
                    <path d="M15 15L25 25" stroke="var(--beige)" strokeWidth="1.5" />
                    <path d="M25 15L15 25" stroke="var(--beige)" strokeWidth="1.5" />
                  </svg>
                </div>
                <h3
                  className="text-2xl lg:text-3xl font-serif mb-3 lg:mb-4"
                  style={{ color: "var(--foreground)", transition: "none" }}
                >
                  Non-Custodial
                </h3>
                <p className="text-sm lg:text-base" style={{ color: "var(--foreground)", transition: "none" }}>
                  Your Assets, Your Control. Unison is fully non-custodial, meaning only you control your funds,
                  always.
                </p>
              </div>

              <div className="md:col-span-2 lg:col-span-1">
                <div
                  className="border border-black/50 w-12 h-12 lg:w-14 lg:h-14 flex items-center justify-center mb-4 lg:mb-6 rounded-lg"
                  style={{ backgroundColor: "var(--button-bg)" }}
                  data-dark-bg="beige"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="svg-icon"
                    aria-hidden="true"
                  >
                    <path d="M10 10L30 30" stroke="var(--beige)" strokeWidth="1.5" />
                    <path d="M10 30L30 10" stroke="var(--beige)" strokeWidth="1.5" />
                    <circle cx="20" cy="20" r="10" stroke="var(--beige)" strokeWidth="1.5" fill="none" />
                  </svg>
                </div>
                <h3
                  className="text-2xl lg:text-3xl font-serif mb-3 lg:mb-4"
                  style={{ color: "var(--foreground)", transition: "none" }}
                >
                  Flexible
                </h3>
                <p className="text-sm lg:text-base" style={{ color: "var(--foreground)", transition: "none" }}>
                  Craft your vaults, customize allocations, and blend strategies your way using Unison's Private Vaults.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        ref={(el) => (sectionsRef.current[2] = el)}
        className="w-full flex items-center bg-[var(--dark-section-bg)] text-white"
      >
        <div className="w-full py-12 lg:py-16 px-6 lg:px-16">
          <div className="max-w-6xl mx-auto">
            <div className="flex mb-10 mt-2 space-x-8 relative">
              <button
                onClick={() => switchTab("individuals")}
                className={`text-sm uppercase relative ${activeTab === "individuals" ? "font-bold" : "hover:opacity-70"}`}
              >
                For Individuals
                {activeTab === "individuals" && <div className="absolute -bottom-2 left-0 w-full h-px bg-white"></div>}
              </button>
              <button
                onClick={() => switchTab("institutions")}
                className={`text-sm uppercase relative ${activeTab === "institutions" ? "font-bold" : "hover:opacity-70"
                  }`}
              >
                For Institutions
                {activeTab === "institutions" && <div className="absolute -bottom-2 left-0 w-full h-px bg-white"></div>}
              </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
              <div className="lg:w-1/2 text-left lg:pr-8">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif leading-tight mb-6">
                  {activeTab === "individuals" ? (
                    <>
                      Curated Vaults,
                      <br />
                      Any Chain,
                      <br />
                      Transparent.
                    </>
                  ) : (
                    <>
                      Non-Custodial,
                      <br />
                      Flexible,
                      <br />
                      Complete control.
                    </>
                  )}
                </h2>
              </div>

              <div className="lg:w-1/2 w-full bg-gradient-to-bl from-zinc-800 to-zinc-900 hover:from-zinc-900 hover:to-zinc-900 transition-all duration-300 border border-white/10 p-6 lg:p-8">
                <div className="min-h-[240px] md:min-h-[320px]">
                  {activeTab === "individuals" ? (
                    <div className="space-y-4 md:space-y-6">
                      <div className="flex items-start">
                        <div className="border border-black w-10 h-10 md:w-12 md:h-12 flex items-center justify-center flex-shrink-0 mr-3 md:mr-4 mt-1 bg-white">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect x="4" y="4" width="16" height="16" stroke="black" strokeWidth="1.5" />
                            <circle cx="12" cy="12" r="4" stroke="black" strokeWidth="1.5" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-xl md:text-2xl font-serif mb-1 md:mb-2">Set and Forget</h3>
                          <p className="text-sm md:text-base">
                            The best yield with the least amount of work. Deposit from any chain and let Unison handle the rest.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="border border-black w-10 h-10 md:w-12 md:h-12 flex items-center justify-center flex-shrink-0 mr-3 md:mr-4 mt-1 bg-white">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M4 20L20 4" stroke="black" strokeWidth="1.5" />
                            <path d="M10 4H20V14" stroke="black" strokeWidth="1.5" />
                            <path d="M4 12L8 8L12 12L16 8" stroke="black" strokeWidth="1.5" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-xl md:text-2xl font-serif mb-1 md:mb-2">Efficient</h3>
                          <p className="text-sm md:text-base">
                            Earn up to 18% APR<sup>*</sup> on your stables with our strategies, optimized across chains.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="border border-black w-10 h-10 md:w-12 md:h-12 flex items-center justify-center flex-shrink-0 mr-3 md:mr-4 mt-1 bg-white">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M12 8V16" stroke="black" strokeWidth="1.5" />
                            <path d="M8 12H16" stroke="black" strokeWidth="1.5" />
                            <path d="M7 7L17 17" stroke="black" strokeWidth="1.5" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-xl md:text-2xl font-serif mb-1 md:mb-2">Transparent</h3>
                          <p className="text-sm md:text-base">
                            Have complete overview of where your assets are deployed, their allocations and performance.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 md:space-y-6">
                      <div className="flex items-start">
                        <div className="border border-black w-10 h-10 md:w-12 md:h-12 flex items-center justify-center flex-shrink-0 mr-3 md:mr-4 mt-1 bg-white">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect x="4" y="4" width="7" height="7" stroke="black" strokeWidth="1.5" />
                            <rect x="13" y="4" width="7" height="7" stroke="black" strokeWidth="1.5" />
                            <rect x="4" y="13" width="7" height="7" stroke="black" strokeWidth="1.5" />
                            <rect x="13" y="13" width="7" height="7" stroke="black" strokeWidth="1.5" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-xl md:text-2xl font-serif mb-1 md:mb-2">Custom</h3>
                          <p className="text-sm md:text-base">
                            Pick your asset, select protocols, set allocations and launch your vaults in minutes.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="border border-black w-10 h-10 md:w-12 md:h-12 flex items-center justify-center flex-shrink-0 mr-3 md:mr-4 mt-1 bg-white">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle cx="12" cy="12" r="8" stroke="black" strokeWidth="1.5" />
                            <path d="M12 8V16" stroke="black" strokeWidth="1.5" />
                            <path d="M8 12H16" stroke="black" strokeWidth="1.5" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-xl md:text-2xl font-serif mb-1 md:mb-2">Flexible</h3>
                          <p className="text-sm md:text-base">
                            Private Vaults can be used to manage Protocol Treasuries, launch yield-generating tokens, or run an on-chain fund.
                          </p>
                        </div>
                      </div>
                      {/*<div className="flex items-start">
                        <div className="border border-gray-500 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center flex-shrink-0 mr-3 md:mr-4 mt-1">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12"
                              stroke="white"
                              strokeWidth="1.5"
                            />
                            <path d="M4 12H20" stroke="white" strokeWidth="1.5" />
                            <path d="M12 12L12 20" stroke="white" strokeWidth="1.5" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-xl md:text-2xl font-serif mb-1 md:mb-2">Non-Custodial</h3>
                          <p className="text-sm md:text-base">
                            Private Vaults are private to you
                          </p>
                        </div>
                      </div>*/}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="w-full font-geist-mono font-medium footer-bg pb-6">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end py-5 px-4">
            <div className="flex flex-col space-y-2 mb-4 md:mb-0 w-full md:w-auto">
              <div className="ml-0 mt-2 mb-4">
                <svg width="36" height="36" viewBox="0 0 720 720" className="mr-2" aria-hidden="true">
                  <path
                    d="M452.672 415.891C462.845 405.719 462.835 389.222 452.65 379.061V379.061C442.48 368.915 426.012 368.928 415.857 379.09L375.431 419.546C342.916 452.085 290.178 452.094 257.651 419.568L144.342 306.259C105.29 267.206 105.29 203.89 144.342 164.837L191.449 117.73C215.805 93.3743 255.294 93.3743 279.65 117.73L305.361 143.442C315.517 153.598 331.983 153.598 342.139 143.442V143.442C352.292 133.288 352.295 116.827 342.145 106.671L298.057 62.5514C263.538 28.0087 207.55 27.999 173.019 62.5297L70.7204 164.828C31.6642 203.885 31.6685 267.209 70.73 306.259L245.84 481.322C284.894 520.365 348.204 520.361 387.252 481.312L452.672 415.891Z"
                    fill="black"
                  />
                  <path
                    d="M261.177 347.033C271.354 357.211 287.857 357.208 298.031 347.027L341.53 303.497C375.725 269.278 431.189 269.268 465.396 303.475L575.662 413.741C614.714 452.794 614.714 516.11 575.662 555.163L528.555 602.27C504.199 626.626 464.71 626.626 440.354 602.27L414.642 576.558C404.487 566.402 388.021 566.402 377.865 576.558V576.558C367.711 586.712 367.709 603.173 377.858 613.329L421.947 657.449C456.466 691.991 512.454 692.001 546.985 657.47L649.283 555.172C688.34 516.115 688.335 452.791 649.274 413.741L474.144 238.659C435.098 199.623 371.803 199.619 332.752 238.65L261.182 310.181C251.002 320.355 251 336.856 261.177 347.033V347.033Z"
                    fill="black"
                  />
                </svg>
              </div>
              <div className="relative inline-block">
                <span
                  className="text-sm !text-zinc-800 hover:text-black block relative"
                  onMouseEnter={() => setShowAppTooltip(true)}
                  onMouseLeave={() => setShowAppTooltip(false)}
                >
                  APP
                </span>
                <div className="w-8 h-px bg-gradient-to-r from-yellow-500 to-transparent"></div>
                {showAppTooltip && (
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-1 bg-black text-white text-xs rounded whitespace-nowrap opacity-90 transition-opacity duration-200 font-geist-mono">
                    COMING SOON
                    <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-black"></div>
                  </div>
                )}
              </div>
              <a target="_blank" rel="noopener noreferrer" href="https://docs.unison.gg" className="text-sm !text-zinc-800 hover:text-black block">
                DOCS
              </a>
              <div className="w-8 h-px bg-gradient-to-r from-yellow-500 to-transparent"></div>
              <a target="_blank" rel="noopener noreferrer" href="https://twitter.com/unison_gg" className="text-sm !text-zinc-800 hover:text-black block">
                X/TWITTER
              </a>
              <div className="w-8 h-px bg-gradient-to-r from-yellow-500 to-transparent"></div>
              <a target="_blank" rel="noopener noreferrer" href="https://discord.gg/wefXKHkjMU" className="text-sm !text-zinc-800 hover:text-black block">
                DISCORD
              </a>
              <div className="w-8 h-px bg-gradient-to-r from-yellow-500 to-transparent"></div>
            </div>
            <a href="https://unison.gg" className="text-sm !text-zinc-700 mt-4 md:mt-0 block bg-white/20 rounded p-2">2025 UNISON - ALL RIGHTS RESERVED<sup>©</sup></a>
          </div>
        </div>
      </div>
    </main>
  )
}
