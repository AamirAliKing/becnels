import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/styles/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ClerkProvider } from "@clerk/nextjs"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Becnels Automotive, LLC",
  description: "Automotive service and repair management system",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=clash-display@600,700,400&display=swap" />
        <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=cal-sans@400,700&display=swap" />
      </head>
      <body className={`${inter.className} font-sans antialiased`}>
        <ClerkProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}

import './globals.css'
import LoginPage from "./login/page"
