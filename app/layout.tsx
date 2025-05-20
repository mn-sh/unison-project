import type React from "react"
import "./globals.css"
import { Instrument_Serif, Kodchasan } from "next/font/google"
import Header from "@/components/header"

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-instrument-serif",
  display: "swap",
})

const kodchasan = Kodchasan({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-kodchasan",
  display: "swap",
})

export const metadata = {
  title: "UNISON - Asset Management & Yield Protocol",
  description: "UNISON is an asset management and yield protocol for issuers, managers, and individuals.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.cdnfonts.com" />
        <link href="https://fonts.cdnfonts.com/css/alte-haas-grotesk" rel="stylesheet" />
      </head>
      <body className={`${instrumentSerif.variable} ${kodchasan.variable}`}>
        <Header />
        {children}
      </body>
    </html>
  )
}
