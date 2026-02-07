import React from "react"
import type { Metadata } from "next"

import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

import { Inter_Tight, IBM_Plex_Sans } from "next/font/google"

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  weight: ["300", "400", "500", "600", "700", "800"],
})

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-ibm-plex",
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: 'CineView AI - Smart Cinematic Visual Analysis Platform',
  description: 'A smart Saudi platform for analyzing and enhancing visual content in a cinematic style. AI-powered tools for photographers and content creators aligned with Saudi Vision 2030.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body
        className={`${interTight.variable} ${ibmPlexSans.variable} font-sans antialiased bg-background text-foreground narrative-flow`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  )
}
