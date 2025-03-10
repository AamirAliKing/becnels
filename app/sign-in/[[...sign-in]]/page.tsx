import { SignIn } from "@clerk/nextjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Car} from "lucide-react"
import Image from 'next/image'



export default function Page() {
  return (
    <>
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
    <div className="container mx-auto px-4 py-3 flex items-center justify-between">
      <div className="flex items-center">
      <Image  alt="logo" src="/logo.png" width={20} height={20} className="w-14 font-bold text-blue-600"/>
      <h1 className="text-xl font-bold text-blue-600 ml-6">Becnels Automotive, LLC</h1>
      </div>
      
    </div>
    </header>
      <Card className="w-full max-w-md mx-auto my-10">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <Car className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center text-white">Sign in to your Becnels Automotive account</CardDescription>
        </CardHeader>
        <CardContent>
          <SignIn />
        </CardContent>
      </Card>
    
    </>
  )
} 