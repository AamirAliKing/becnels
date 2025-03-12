import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProfileCard } from "./ProfileCard"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { navLinks } from "./MainNav"
import { useState } from "react"
import { motion } from "framer-motion"

interface MobileMenuProps {
  userName: string
  profileImage: string
  onEditProfile: () => void
  onScheduleService: () => void
}

export function MobileMenu({
  userName,
  profileImage,
  onEditProfile,
  onScheduleService
}: MobileMenuProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const handleEditProfile = () => {
    setIsOpen(false) // Close the sheet
    onEditProfile() // Open the profile dialog
  }

  const handleScheduleService = () => {
    setIsOpen(false) // Close the sheet
    onScheduleService() // Open the appointment dialog
  }

  // Function to check if a link is active
  const isLinkActive = (href: string) => {
    if (href === "/") {
      return pathname === href
    }
    return pathname?.startsWith(href)
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden hover:bg-gray-100 transition-colors duration-200"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="left" 
        className="w-[300px] sm:w-[400px] overflow-y-auto rounded-r-2xl border-r-0 p-6"
      >
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl font-bold">Menu</SheetTitle>
        </SheetHeader>
        
        {/* Profile Card Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <ProfileCard
            userName={userName}
            profileImage={profileImage}
            onEditProfile={handleEditProfile}
            onScheduleService={handleScheduleService}
          />
        </motion.div>

        <Separator className="my-6" />

        {/* Navigation Links */}
        <nav className="flex flex-col space-y-2">
          {navLinks.map((link, index) => (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center py-3 px-4 rounded-xl font-medium transition-all duration-200",
                  "hover:bg-blue-50 hover:text-blue-600",
                  "active:scale-95",
                  isLinkActive(link.href)
                    ? "bg-blue-50 text-blue-600 shadow-sm"
                    : "text-gray-600"
                )}
              >
                {link.label}
              </Link>
            </motion.div>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
} 