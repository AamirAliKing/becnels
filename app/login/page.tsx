import Image from "next/image"
import Link from "next/link"
import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <Link href="/" className="flex items-center">
            <h1 className="text-xl font-bold text-blue-600">Becnels Automotive, LLC</h1>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="hidden md:block">
            <div className="relative h-[400px] w-full rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/placeholder.svg?height=400&width=500"
                alt="Automotive service"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
          <div>
            <LoginForm />
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-500 text-sm mb-2 md:mb-0">© 2025 Becnels Automotive, LLC. All rights reserved.</div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">
              Terms of Service
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-700 text-sm">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

