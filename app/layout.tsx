import type React from "react"
import "./globals.css"
import { Instrument_Serif, Kodchasan, Geist_Mono} from "next/font/google"
import Header from "@/components/header"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

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

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-geist-mono",
  display: "swap",
})

export const metadata = {
  title: "Unison - Asset Management & Yield Protocol",
  description: "UNISON is an asset management and yield protocol for issuers, managers, and individuals.",
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "16x16" },
      { url: "/favicon.png", sizes: "32x32" },
    ],
    shortcut: [{ url: "/favicon.png" }],
    apple: [{ url: "/favicon.png", sizes: "180x180" }],
  },
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
      <body className={`${instrumentSerif.variable} ${kodchasan.variable} ${geistMono.variable}`}>
        <Header />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
