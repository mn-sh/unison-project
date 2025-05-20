"use client"

import Link from "next/link"
import { useState, useCallback, memo } from "react"
import { Menu, X } from "lucide-react"
import ThemeSwitcher from "./theme-switcher"

const Header = memo(() => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev)
  }, [])

  const handleMouseEnter = useCallback(() => {
    setShowTooltip(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setShowTooltip(false)
  }, [])

  // Hardcoded background color
  const bgColor = "rgba(18, 18, 18, 0.9)"

  return (
    <header
      style={{
        backgroundColor: bgColor,
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        padding: "1rem 1.5rem",
        transition: "color 0.3s ease, background-color 0.3s ease",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
      className="text-white"
    >
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link
          href="/"
          className="text-xl lg:text-2xl font-kodchasan uppercase tracking-wide text-white flex items-center"
        >
          <svg width="36" height="36" viewBox="0 0 720 720" className="mr-2" aria-hidden="true">
            <path
              d="M452.672 415.891C462.845 405.719 462.835 389.222 452.65 379.061V379.061C442.48 368.915 426.012 368.928 415.857 379.09L375.431 419.546C342.916 452.085 290.178 452.094 257.651 419.568L144.342 306.259C105.29 267.206 105.29 203.89 144.342 164.837L191.449 117.73C215.805 93.3743 255.294 93.3743 279.65 117.73L305.361 143.442C315.517 153.598 331.983 153.598 342.139 143.442V143.442C352.292 133.288 352.295 116.827 342.145 106.671L298.057 62.5514C263.538 28.0087 207.55 27.999 173.019 62.5297L70.7204 164.828C31.6642 203.885 31.6685 267.209 70.73 306.259L245.84 481.322C284.894 520.365 348.204 520.361 387.252 481.312L452.672 415.891Z"
              fill="white"
            />
            <path
              d="M261.177 347.033C271.354 357.211 287.857 357.208 298.031 347.027L341.53 303.497C375.725 269.278 431.189 269.268 465.396 303.475L575.662 413.741C614.714 452.794 614.714 516.11 575.662 555.163L528.555 602.27C504.199 626.626 464.71 626.626 440.354 602.27L414.642 576.558C404.487 566.402 388.021 566.402 377.865 576.558V576.558C367.711 586.712 367.709 603.173 377.858 613.329L421.947 657.449C456.466 691.991 512.454 692.001 546.985 657.47L649.283 555.172C688.34 516.115 688.335 452.791 649.274 413.741L474.144 238.659C435.098 199.623 371.803 199.619 332.752 238.65L261.182 310.181C251.002 320.355 251 336.856 261.177 347.033V347.033Z"
              fill="white"
            />
          </svg>
          UNISON
        </Link>

        <nav
          className={`${
            isMenuOpen ? "flex" : "hidden"
          } md:flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8 absolute md:relative top-full left-0 right-0 p-6 md:p-0 rounded-b-md`}
          style={{
            backgroundColor: isMenuOpen ? bgColor : "transparent",
            backdropFilter: isMenuOpen ? "blur(8px)" : "none",
            WebkitBackdropFilter: isMenuOpen ? "blur(8px)" : "none",
          }}
        >
          <Link
            href="https://docs.unison.gg"
            className="text-sm font-bold font-alte-haas underline decoration-yellow-400 underline-offset-4 flex items-center text-white"
          >
            docs
          </Link>
          <div className="relative">
            <Link
              href="#"
              className="inline-flex items-center justify-center bg-gradient-to-bl from-zinc-700 to-zinc-900 hover:from-zinc-900 hover:to-zinc-700 px-4 py-2 text-black border border-gray-500 text-sm rounded-md h-[42px] lg:h-[45px]"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <span className="flex items-center">
                Launch App <span className="ml-2">→</span>
              </span>
            </Link>
            {showTooltip && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-1 bg-black text-white text-xs rounded whitespace-nowrap opacity-90 transition-opacity duration-200">
                Coming Soon
                <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-black"></div>
              </div>
            )}
          </div>
          <ThemeSwitcher className="ml-2" />
        </nav>

        <button
          className="md:hidden text-white"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
        </button>
      </div>
    </header>
  )
})

Header.displayName = "Header"

export default Header
