"use client"

import { SignIn } from "@clerk/nextjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Car } from "lucide-react"

export function LoginForm() {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <div className="flex justify-center mb-4">
          <div className="bg-blue-600 p-3 rounded-full">
            <Car className="h-6 w-6 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
        <CardDescription className="text-center">Sign in to your Becnels Automotive account</CardDescription>
      </CardHeader>
      <CardContent>
        <SignIn />
      </CardContent>
    </Card>
  )
}

