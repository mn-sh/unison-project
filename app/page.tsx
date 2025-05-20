"use client"

import { useState, useEffect, useCallback, useRef, memo } from "react"
import Link from "next/link"
import { Plus, DollarSign, Bitcoin, X } from "lucide-react"
import InteractiveCard from "@/components/interactive-card"
import GameOfLife from "@/components/game-of-life"
import CompatibleChains from "@/components/compatible-chains"
import { useIsMobile } from "@/hooks/use-mobile"

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
  const TOTAL_SECTIONS = 5

  // State
  const [openAccordion, setOpenAccordion] = useState<number | null>(0)
  const [activeTab, setActiveTab] = useState("individuals")
  const [hasTabSwitched, setHasTabSwitched] = useState(false)
  const [activeSection, setActiveSection] = useState(0)

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

  // Reset tab state when entering/leaving section 2
  useEffect(() => {
    if (activeSection === 2) {
      if (!hasTabSwitched) {
        setActiveTab("individuals")
      }
    } else {
      setHasTabSwitched(false)
    }
  }, [activeSection, hasTabSwitched])

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

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section ref={(el) => (sectionsRef.current[0] = el)} className="min-h-screen w-full flex items-center">
        <div className="w-full pt-16 lg:pt-24 px-6 lg:px-16">
          <div className="max-w-6xl mx-auto">
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
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-serif mb-3 lg:mb-6 leading-tight">
                    <span className="block font-serif">Asset Management & Yield Protocol</span>
                    <span className="block text-[70%] sm:text-[75%] text-black/70 mt-2">
                      For Issuers, Managers & You.
                    </span>
                  </h1>

                  <form className="flex flex-col sm:flex-row gap-2 w-full mb-2 sm:mb-4">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="flex-grow px-4 py-2 border border-black text-sm lg:text-base bg-white h-[42px] lg:h-[50px] rounded-md"
                      required
                    />
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center px-4 py-2 lg:px-6 text-white border border-white/20 text-sm lg:text-base whitespace-nowrap h-[42px] lg:h-[50px] rounded-md"
                    >
                      <span className="flex items-center">Join Waitlist</span>
                    </button>
                  </form>

                  <div className="-mt-4 sm:mt-0">
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

      {/* Benefits Section */}
      <section
        ref={(el) => {
          sectionsRef.current[1] = el
          if (el) el.setAttribute("data-section", "benefits")
        }}
        className="min-h-screen w-full flex items-center bg-[var(--background)]"
        style={{ color: "var(--foreground)" }}
      >
        <div className="w-full py-12 lg:py-16 px-6 lg:px-16">
          <div className="max-w-6xl mx-auto">
            <div className="mb-2 text-sm uppercase">BENEFITS</div>
            <div className="w-16 h-px bg-black mb-6"></div>

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
                  Deposit from Any Chain and Seamlessly Earn Yield Across Protocols on Any Chain. Unison Vaults Are
                  Natively Cross-Chain
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
                  Self-Custodial
                </h3>
                <p className="text-sm lg:text-base" style={{ color: "var(--foreground)", transition: "none" }}>
                  Your Assets, Your Control. Unison is fully self-custodial, meaning only you control your funds,
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
                  Specialized
                </h3>
                <p className="text-sm lg:text-base" style={{ color: "var(--foreground)", transition: "none" }}>
                  Craft Your Vaults, Customize Allocations, and Blend Strategies Your Way using Unison's Modular
                  Architecture.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        ref={(el) => (sectionsRef.current[2] = el)}
        className="min-h-screen w-full flex items-center bg-[var(--dark-section-bg)] text-white"
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
                className={`text-sm uppercase relative ${
                  activeTab === "institutions" ? "font-bold" : "hover:opacity-70"
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
                      Full transparency.
                    </>
                  ) : (
                    <>
                      Personal,
                      <br />
                      Customizable,
                      <br />
                      Complete control.
                    </>
                  )}
                </h2>
              </div>

              <div className="lg:w-1/2 w-full border border-gray-700 bg-[#1a1a1a] p-6 lg:p-8">
                <div className="min-h-[240px] md:min-h-[320px]">
                  {activeTab === "individuals" ? (
                    <div className="space-y-4 md:space-y-6">
                      <div className="flex items-start">
                        <div className="border border-gray-500 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center flex-shrink-0 mr-3 md:mr-4 mt-1">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect x="4" y="4" width="16" height="16" stroke="white" strokeWidth="1.5" />
                            <circle cx="12" cy="12" r="4" stroke="white" strokeWidth="1.5" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-xl md:text-2xl font-serif mb-1 md:mb-2">Personal Wallet</h3>
                          <p className="text-sm md:text-base">
                            Secure your assets with our non-custodial solution that gives you complete control over your
                            digital assets.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="border border-gray-500 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center flex-shrink-0 mr-3 md:mr-4 mt-1">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M4 20L20 4" stroke="white" strokeWidth="1.5" />
                            <path d="M10 4H20V14" stroke="white" strokeWidth="1.5" />
                            <path d="M4 12L8 8L12 12L16 8" stroke="white" strokeWidth="1.5" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-xl md:text-2xl font-serif mb-1 md:mb-2">Yield Generation</h3>
                          <p className="text-sm md:text-base">
                            Earn up to 18% APR on your stable assets with our transparent yield generation strategies.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="border border-gray-500 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center flex-shrink-0 mr-3 md:mr-4 mt-1">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M4 12H12M20 12H12M12 12V4M12 12V20" stroke="white" strokeWidth="1.5" />
                            <path d="M7 7L17 17" stroke="white" strokeWidth="1.5" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-xl md:text-2xl font-serif mb-1 md:mb-2">Multi-Chain Support</h3>
                          <p className="text-sm md:text-base">
                            Access multiple blockchains from one interface with seamless cross-chain operations.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 md:space-y-6">
                      <div className="flex items-start">
                        <div className="border border-gray-500 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center flex-shrink-0 mr-3 md:mr-4 mt-1">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect x="4" y="4" width="7" height="7" stroke="white" strokeWidth="1.5" />
                            <rect x="13" y="4" width="7" height="7" stroke="white" strokeWidth="1.5" />
                            <rect x="4" y="13" width="7" height="7" stroke="white" strokeWidth="1.5" />
                            <rect x="13" y="13" width="7" height="7" stroke="white" strokeWidth="1.5" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-xl md:text-2xl font-serif mb-1 md:mb-2">Custom Infrastructure</h3>
                          <p className="text-sm md:text-base">
                            Tailored solutions for your organization's specific needs with flexible deployment options.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="border border-gray-500 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center flex-shrink-0 mr-3 md:mr-4 mt-1">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle cx="12" cy="12" r="8" stroke="white" strokeWidth="1.5" />
                            <path d="M12 8V16" stroke="white" strokeWidth="1.5" />
                            <path d="M8 12H16" stroke="white" strokeWidth="1.5" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-xl md:text-2xl font-serif mb-1 md:mb-2">Advanced Security</h3>
                          <p className="text-sm md:text-base">
                            Enterprise-grade security and compliance features to protect your organization's assets.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
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
                          <h3 className="text-xl md:text-2xl font-serif mb-1 md:mb-2">Dedicated Support</h3>
                          <p className="text-sm md:text-base">
                            24/7 priority support and dedicated account management for your institution.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section - Updated with responsive cards for mobile */}
      <section
        ref={(el) => (sectionsRef.current[3] = el)}
        className="min-h-screen w-full flex items-center bg-[var(--background)]"
      >
        <div className="w-full py-12 lg:py-16 px-6 lg:px-16">
          <div className="max-w-6xl mx-auto">
            <div>
              {/* Section heading */}
              <div className="mb-10">
                <div className="mb-2 text-sm uppercase" style={{ color: "var(--foreground)", transition: "none" }}>
                  VAULTS
                </div>
                <div className="w-16 h-px bg-black mb-6"></div>
              </div>

              {/* Content area with heading and cards side by side */}
              <div className="flex flex-col lg:flex-row items-start gap-6">
                {/* Left column with subheading */}
                <div className="lg:w-1/3">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif leading-tight text-[var(--foreground)]">
                    Earn yield on your assets
                  </h2>
                </div>

                {/* Right column with vault cards */}
                <div className="lg:w-2/3 w-full">
                  {/* Modified grid for mobile to make cards take full width */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mx-0">
                    {/* Stables Card */}
                    <InteractiveCard
                      className="interactive-card p-4 relative flex flex-col justify-between h-[170px] w-full mx-0 rounded-3xl"
                      style={{
                        backgroundColor: "#7fd177",
                        boxShadow: "none",
                        borderRadius: "5px",
                        /*border: "1px solid #b8d9ff",*/
                      }}
                    >
                      <div>
                        <div className="text-[var(--foreground)] text-lg sm:text-xl md:text-2xl font-serif mb-1">
                          Stables
                        </div>
                        <h3 className="text-[var(--foreground)] text-xl sm:text-2xl md:text-3xl font-bold mb-0 tracking-tight">
                          13-18%<sup>*</sup>
                        </h3>
                        <p className="text-[var(--foreground)] opacity-70 text-xs italic">
                          *based on last 3 months data
                        </p>
                      </div>
                      <div className="flex justify-end">
                        <DollarSign className="w-6 h-6 text-[var(--foreground)] opacity-30" />
                      </div>
                    </InteractiveCard>

                    {/* Ethereum Card */}
                    <InteractiveCard
                      className="interactive-card p-4 relative flex flex-col justify-between h-[170px] w-full mx-0 rounded-3xl"
                      style={{
                        backgroundColor: "#739cf5",
                        boxShadow: "none",
                        borderRadius: "5px",
                        /*border: "1px solid #d0d0d0",*/
                      }}
                    >
                      <div>
                        <div className="text-[var(--foreground)] text-lg sm:text-xl md:text-2xl font-serif mb-1">
                          Ethereum
                        </div>
                        <h3 className="text-[var(--foreground)] text-xl sm:text-2xl md:text-3xl font-bold mb-0 tracking-tight">
                          8-12%<sup>*</sup>
                        </h3>
                        <p className="text-[var(--foreground)] opacity-70 text-xs italic">
                          *based on last 3 months data
                        </p>
                      </div>
                      <div className="flex justify-end">
                        <span className="text-[var(--foreground)] opacity-30 text-2xl font-bold">Ξ</span>
                      </div>
                    </InteractiveCard>

                    {/* Bitcoin Card */}
                    <InteractiveCard
                      className="interactive-card p-4 relative flex flex-col justify-between h-[170px] w-full mx-0 rounded-3xl"
                      style={{
                        backgroundColor: "#f2b035",
                        boxShadow: "none",
                        borderRadius: "5px",
                        /*border: "1px solid #ffd9a3",*/
                      }}
                    >
                      <div>
                        <div className="text-[var(--foreground)] text-lg sm:text-xl md:text-2xl font-serif mb-1">
                          Bitcoin
                        </div>
                        <h3 className="text-[var(--foreground)] text-xl sm:text-2xl md:text-3xl font-bold mb-0 tracking-tight">
                          5-9%<sup>*</sup>
                        </h3>
                        <p className="text-[var(--foreground)] opacity-70 text-xs italic">
                          *based on last 3 months data
                        </p>
                      </div>
                      <div className="flex justify-end">
                        <Bitcoin className="w-6 h-6 text-[var(--foreground)] opacity-30" />
                      </div>
                    </InteractiveCard>

                    {/* Your Favorite Assets Card */}
                    <InteractiveCard
                      className="interactive-card p-4 relative flex flex-col justify-between h-[170px] w-full mx-0 rounded-3xl"
                      style={{
                        backgroundColor: "var(--card-bg)",
                        boxShadow: "none",
                        borderRadius: "5px",
                        border: "1px solid rgba(0,0,0,0.1)",
                      }}
                    >
                      <div className="flex flex-col justify-between h-full">
                        <div className="text-[var(--foreground)] text-2xl sm:text-3xl md:text-4xl font-serif">
                          Your Own Vaults
                        </div>
                        <div className="flex justify-end">
                          <Plus className="w-6 h-6 text-[var(--foreground)] opacity-30" />
                        </div>
                      </div>
                    </InteractiveCard>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ + Footer Section */}
      <section
        ref={(el) => (sectionsRef.current[4] = el)}
        className="min-h-screen w-full flex flex-col bg-[var(--background)]"
      >
        {/* FAQ Content - Centered in viewport */}
        <div className="flex-1 flex items-center">
          <div className="w-full px-4 sm:px-6 lg:px-16 py-16 sm:py-20 md:py-24">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-24">
                <div>
                  <div className="mb-2 text-sm uppercase">FAQS</div>
                  <div className="w-16 h-px bg-black mb-6"></div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif mb-8">Got some questions?</h2>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  {[
                    {
                      title: "How long does the design process take?",
                      content:
                        "The timeline varies depending on scope and complexity. Brand design takes about 4-6 weeks, website design 6-8 weeks, and combined projects typically 8-12 weeks.",
                    },
                    {
                      title: "What do I need to provide before starting?",
                      content:
                        "To get started, we'll need your project goals, target audience information, brand guidelines (if available), and any specific requirements or preferences you have for the project.",
                    },
                    {
                      title: "Can I make revisions during the process?",
                      content:
                        "Yes, revisions are an integral part of our collaborative process. Each project includes dedicated revision rounds to ensure the final result meets your expectations.",
                    },
                  ].map((faq, index) => (
                    <div key={index} className="group border-b border-black/30 pb-4">
                      <button
                        onClick={() => toggleAccordion(index)}
                        className="w-full flex justify-between items-center py-2 text-left focus:outline-none"
                        aria-expanded={openAccordion === index}
                      >
                        <h3 className="text-base lg:text-lg font-medium pr-4">{faq.title}</h3>
                        <div
                          className={`transition-transform duration-200 flex-shrink-0 ${openAccordion === index ? "rotate-45" : ""}`}
                        >
                          <Plus className="w-4 h-4" />
                        </div>
                      </button>
                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          openAccordion === index ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                        }`}
                      >
                        <p className="text-sm text-black/70 pt-2 pb-1">{faq.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Black background at bottom */}
        <div className="w-full bg-black text-white py-6 sm:py-8 px-4 sm:px-6 lg:px-16">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-6 md:mb-0">
                <nav className="flex flex-wrap justify-center md:justify-start gap-4 sm:gap-6">
                  <Link href="/" className="text-sm text-white/80 hover:text-white">
                    HOME
                  </Link>
                  <Link href="/about" className="text-sm text-white/80 hover:text-white">
                    ABOUT
                  </Link>
                  <Link href="/projects" className="text-sm text-white/80 hover:text-white">
                    PROJECTS
                  </Link>
                </nav>
              </div>

              <div className="flex space-x-4">
                <Link
                  href="#"
                  className="w-8 h-8 rounded-full border border-white/40 flex items-center justify-center hover:bg-white hover:text-black transition-colors"
                  aria-label="X (Twitter)"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="lucide lucide-twitter-x"
                    aria-hidden="true"
                  >
                    <path
                      d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"
                      stroke="none"
                      fill="currentColor"
                    ></path>
                  </svg>
                </Link>
                <Link
                  href="#"
                  className="w-8 h-8 rounded-full border border-white/40 flex items-center justify-center hover:bg-white hover:text-black transition-colors"
                  aria-label="Discord"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-discord"
                    aria-hidden="true"
                  >
                    <circle cx="9" cy="12" r="1" />
                    <circle cx="15" cy="12" r="1" />
                    <path d="M7.5 7.5c3.5-1 5.5-1 9 0" />
                    <path d="M7 16.5c3.5 1 6.5 1 10 0" />
                    <path d="M15.5 17c0 1 1.5 3 2 3 1.5 0 2.833-1.667 3.5-3 .667-1.667.5-5.833-1.5-11.5-1.457-1.015-3-1.34-4.5-1.5l-1 2.5" />
                    <path d="M8.5 17c0 1-1.356 3-1.832 3-1.429 0-2.698-1.667-3.333-3-.635-1.667-.48-5.833 1.428-11.5C6.151 4.485 7.545 4.16 9 4l1 2.5" />
                  </svg>
                </Link>
              </div>
            </div>
            <div className="text-xs text-center md:text-left mt-6 text-white/60">
              © {new Date().getFullYear()} UNISON. All rights reserved.
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
