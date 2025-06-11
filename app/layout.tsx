import React from "react"
import type { Metadata, Viewport } from "next"
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
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
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
            <div className="fixed inset-0 -z-10 h-full w-full bg-white dark:bg-black opacity-20">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950 dark:via-purple-950 dark:to-pink-950" />
            </div>
            
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
