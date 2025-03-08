import Link from "next/link"
import Image from "next/image"
import { Bell } from "lucide-react"
import { UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Image alt="logo" src="/logo.png" className="w-14 font-bold text-blue-600" width={20} height={20}/>
          <h1 className="text-xl font-bold text-blue-600 ml-6">Becnels Automotive, LLC</h1>
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#" className="font-medium text-gray-900 border-b-2 border-blue-600 pb-1">
            Dashboard
          </a>
          <Link
            href="/messages"
            className="font-medium text-gray-500 hover:text-gray-900 hover:border-b-2 hover:border-blue-600 pb-1 transition-all"
          >
            Messages
          </Link>
          <Link
            href="/vehicles"
            className="font-medium text-gray-500 hover:text-gray-900 hover:border-b-2 hover:border-blue-600 pb-1 transition-all"
          >
            My Vehicle
          </Link>
          <a
            href="#"
            className="font-medium text-gray-500 hover:text-gray-900 hover:border-b-2 hover:border-blue-600 pb-1 transition-all"
          >
            Repairs
          </a>
        </nav>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
          </Button>
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </div>
    </header>
  )
} 