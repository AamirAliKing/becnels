import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Car } from "lucide-react"
import Image from 'next/image'
import Link from 'next/link'

export async function generateStaticParams() {
  // For a sign-in page, we typically only need the base route
  return [
    { 'sign-in': [] },  // Matches /sign-in
    { 'sign-in': ['sso-callback'] },  // Matches /sign-in/sso-callback
    { 'sign-in': ['factor-one'] },  // Matches /sign-in/factor-one
    { 'sign-in': ['factor-two'] }  // Matches /sign-in/factor-two
  ]
}

export default function Page() {
  return (
    <>
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Image alt="logo" src="/logo.png" width={20} height={20} className="w-14 font-bold text-blue-600"/>
          <h1 className="text-xl font-bold text-blue-600 ml-6">Becnels Automotive, LLC</h1>
        </div>
      </div>
    </header>
    <div className="max-w-md mx-auto my-40">
      <Card className="w-full">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <Car className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center">Sign in to your Becnels Automotive account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Link href="/dashboard">
              <Button className="w-full">Sign In as Demo User</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
    </>
  )
}