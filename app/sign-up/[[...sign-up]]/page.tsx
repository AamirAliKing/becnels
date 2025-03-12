'use client';

import { SignIn, SignUp } from "@clerk/nextjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Car, Divide } from "lucide-react"
import Image from 'next/image'
import Link from 'next/link'

export default function Page() {
  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <Link href="/" className="flex items-center">
            <Image 
              alt="logo" 
              src="/logo.png" 
              width={56} 
              height={56} 
              className="w-14 font-bold text-blue-600"
            />
            <h1 className="text-xl font-bold text-blue-600 ml-6">Becnels Automotive, LLC</h1>
          </Link>
        </div>
      </header>
      <div className="w-full max-w-md mx-auto my-12">
        
          <SignUp />
       
      </div>
    </>
  )
} 