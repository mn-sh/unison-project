"use client"

import type React from "react"
import { useState, useRef, type ReactNode, useCallback, memo } from "react"

interface InteractiveCardProps {
  children: ReactNode
  className?: string
  style?: React.CSSProperties
}

const InteractiveCard = memo(({ children, className = "", style = {} }: InteractiveCardProps) => {
  const [shadowOffset, setShadowOffset] = useState({ x: 4, y: 4 })
  const cardRef = useRef<HTMLDivElement>(null)
  const isHoveringRef = useRef(false)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !isHoveringRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    // Calculate distance from center (normalized)
    const distanceX = (e.clientX - centerX) / (rect.width / 2)
    const distanceY = (e.clientY - centerY) / (rect.height / 2)

    // Calculate new shadow position (max 6px offset)
    const newX = Math.min(Math.max(4 + distanceX * 2, 2), 6)
    const newY = Math.min(Math.max(4 + distanceY * 2, 2), 6)

    setShadowOffset({ x: newX, y: newY })
  }, [])

  const handleMouseEnter = useCallback(() => {
    isHoveringRef.current = true
  }, [])

  const handleMouseLeave = useCallback(() => {
    isHoveringRef.current = false
    setShadowOffset({ x: 4, y: 4 }) // Reset to default
  }, [])

  const shadowStyle = {
    boxShadow: `${shadowOffset.x}px ${shadowOffset.y}px 0px 0px rgba(0,0,0,0.2)`,
    transition: "box-shadow 0.1s ease-out",
    borderRadius: "1.5rem", // Ensure border radius is applied
    ...style, // This will allow style prop to override if needed
  }

  return (
    <div
      ref={cardRef}
      className={className}
      style={shadowStyle}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  )
})

InteractiveCard.displayName = "InteractiveCard"

export default InteractiveCard
