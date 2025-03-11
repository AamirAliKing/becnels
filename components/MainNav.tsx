import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { Bell } from "lucide-react"
import { UserButton, useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { MobileMenu } from "./MobileMenu"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import dynamic from 'next/dynamic'
import { supabase } from '@/lib/supabase'
import { syncUserWithSupabase, updateUserProfile } from "@/lib/services/userService"

// Lazy load dialogs
const ProfileDialog = dynamic(() => import('@/components/dialogs/ProfileDialog'), { ssr: false })
const AppointmentDialog = dynamic(() => import('@/components/dialogs/AppointmentDialog'), { ssr: false })

export const navLinks = [
  { href: "/", label: "Dashboard" },
  { href: "/messages", label: "Messages" },
  { href: "/vehicles", label: "My Vehicle" },
  { href: "/repairs", label: "Repairs" },
]

export function MainNav() {
  const pathname = usePathname()
  const { user, isLoaded } = useUser()
  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [profileImage, setProfileImage] = useState("/placeholder.svg")
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false)
  const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false)

  // Function to check if a link is active
  const isLinkActive = (href: string) => {
    if (href === "/") {
      return pathname === href
    }
    return pathname?.startsWith(href)
  }

  useEffect(() => {
    const syncUser = async () => {
      if (!isLoaded || !user) return

      try {
        // Get user details from Clerk
        const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || ''
        const email = user.emailAddresses[0]?.emailAddress || ''
        const imageUrl = user.imageUrl || "/placeholder.svg"

        // Sync with Supabase
        const { user: supabaseUser } = await syncUserWithSupabase({
          clerk_id: user.id,
          full_name: fullName,
          email: email,
          profile_image_url: imageUrl,
        })

        // Update local state
        setUserName(fullName)
        setUserEmail(email)
        setProfileImage(imageUrl)

        // If no Supabase user was returned, create a new record
        if (!supabaseUser) {
          const { data, error } = await supabase
            .from('user_profiles')
            .insert([
              {
                clerk_id: user.id,
                full_name: fullName,
                email: email,
                profile_image_url: imageUrl
              }
            ])
            .select()

          if (error) {
            console.error('Error creating user profile:', error)
          }
        }
      } catch (error) {
        console.error('Error syncing user:', error)
      }
    }

    syncUser()
  }, [isLoaded, user])

  const handleProfileUpdate = async () => {
    if (!user) return

    try {
      await updateUserProfile({
        clerk_id: user.id,
        full_name: userName,
        email: userEmail,
        profile_image_url: profileImage,
      })
      setIsProfileDialogOpen(false)
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (event) => {
      if (event.target?.result) {
        const newImageUrl = event.target.result as string
        setProfileImage(newImageUrl)

        // Update Supabase when image changes
        if (user) {
          try {
            await updateUserProfile({
              clerk_id: user.id,
              full_name: userName,
              email: userEmail,
              profile_image_url: newImageUrl,
            })
          } catch (error) {
            console.error('Error updating profile image:', error)
          }
        }
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
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

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "font-medium transition-all pb-1",
                isLinkActive(link.href)
                  ? "text-gray-900 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-900 hover:border-b-2 hover:border-blue-600"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
          </Button>
          <UserButton afterSignOutUrl="/sign-in" />
          {/* Mobile Menu */}
          <MobileMenu
            userName={userName}
            profileImage={profileImage}
            onEditProfile={() => setIsProfileDialogOpen(true)}
            onScheduleService={() => setIsAppointmentDialogOpen(true)}
          />
        </div>
      </div>

      {/* Dialogs */}
      {isProfileDialogOpen && (
        <ProfileDialog
          isOpen={isProfileDialogOpen}
          onClose={() => setIsProfileDialogOpen(false)}
          profileImage={profileImage}
          userName={userName}
          userEmail={userEmail || user?.emailAddresses[0]?.emailAddress || ""}
          vehicle="No vehicle added"
          onImageUpload={handleImageUpload}
          onProfileUpdate={handleProfileUpdate}
        />
      )}

      {isAppointmentDialogOpen && (
        <AppointmentDialog
          isOpen={isAppointmentDialogOpen}
          onClose={() => setIsAppointmentDialogOpen(false)}
        />
      )}
    </header>
  )
} 