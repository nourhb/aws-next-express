import React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/theme-provider"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "AWS Next Express - Dual Database App",
  description: "Application Next.js avec AWS RDS et DynamoDB pour notre projet ITEAM University",
  keywords: [
    "Next.js 15",
    "AWS",
    "RDS",
    "DynamoDB", 
    "S3",
    "Docker",
    "TypeScript",
    "Prisma",
    "ITEAM University"
  ],
  authors: [
    { name: "Nour el houda Bouajila", url: "mailto:nour.bouajila@iteam.tn" },
    { name: "Ghofrane Nasri", url: "mailto:ghofrane.nasri@iteam.tn" }
  ],
  creator: "ITEAM University Students",
  openGraph: {
    title: "AWS Next Express - Dual Database App",
    description: "Projet étudiant avec support RDS et DynamoDB",
    type: "website",
    locale: "fr_FR",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gradient-to-br from-background via-background to-muted/20`}
      >
        <ThemeProvider
          defaultTheme="system"
          defaultColorTheme="blue"
          storageKey="aws-next-express-theme"
        >
          <div className="relative min-h-screen">
            {/* Background pattern */}
            <div className="fixed inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)] dark:bg-black dark:[background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] opacity-20" />
            
            {/* Grain texture overlay */}
            <div className="fixed inset-0 -z-10 opacity-20">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)" opacity="0.4"/%3E%3C/svg%3E')] animate-pulse" />
            </div>

            {/* Main content */}
            <main className="relative z-10">
              {children}
            </main>

            {/* Toast notifications */}
            <Toaster 
              position="top-right" 
              richColors 
              closeButton
              className="toaster-custom"
            />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
