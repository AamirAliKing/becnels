"use client";

import type React from "react"
import dynamic from 'next/dynamic'
import Link from "next/link"
import { UserButton, useUser } from "@clerk/nextjs"
import { useState, useEffect, Suspense } from "react"
import Image from "next/image"
import { Bell, Calendar, Car, Clock, Edit, FileText, History, Play, Plus, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { supabase } from '@/lib/supabase'

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Header } from "@/components/Header"
import { ProfileCard } from "@/components/ProfileCard"
import { syncUserWithSupabase, updateUserProfile } from "@/lib/services/userService"
import { MobileMenu } from "@/components/MobileMenu"
import { MainNav } from "@/components/MainNav"
import { CardSkeleton, ProfileCardSkeleton, ServiceUpdateSkeleton } from "@/components/ui/skeleton"

interface Vehicle {
  id: string
  make: string
  model: string
  year: string
  color: string
  vin: string
  licensePlate: string
  mileage: string
  images: string[]
  purchaseDate?: string
  lastService?: string
  notes?: string
}

// Lazy load dialogs and heavy components
const ImageDialog = dynamic(() => import('@/components/dialogs/ImageDialog'), { ssr: false })
const VideoDialog = dynamic(() => import('@/components/dialogs/VideoDialog'), { ssr: false })
const ProfileDialog = dynamic(() => import('@/components/dialogs/ProfileDialog'), { ssr: false })
const AppointmentDialog = dynamic(() => import('@/components/dialogs/AppointmentDialog'), { ssr: false })

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const [profileImage, setProfileImage] = useState("/placeholder.svg?height=96&width=96")
  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false)
  const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeUser = async () => {
      if (!user) return

      try {
        setIsLoading(true)
        const { user: supabaseUser } = await syncUserWithSupabase({
          clerk_id: user.id,
          full_name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || '',
          email: user.emailAddresses[0]?.emailAddress || '',
          profile_image_url: user.imageUrl || '',
        })
        
        if (supabaseUser) {
          setUserName(supabaseUser.full_name)
          setUserEmail(supabaseUser.email)
          setProfileImage(supabaseUser.profile_image_url || "/placeholder.svg?height=96&width=96")

          const { data, error } = await supabase
            .from('user_profiles')
            .insert([
              {
                id: user.id,
                clerk_id:user.id,
                full_name:userName, // Clerk user ID
                email: userEmail,
                profile_image_url:user.imageUrl

              },
            ])
            .select()

          if (error) {
            console.error('Error saving profile:', error)
          } else {
            console.log('Profile saved:', data)
          }

        } else {
          setUserName(`${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || '')
          setUserEmail(user.emailAddresses[0]?.emailAddress || '')
          setProfileImage(user.imageUrl || "/placeholder.svg?height=96&width=96")
        }

        // Load vehicle data from localStorage
        const savedVehicle = localStorage.getItem('vehicle')
        if (savedVehicle) {
          setVehicle(JSON.parse(savedVehicle))
        }
      } catch (error) {
        console.error('Error initializing user:', error)
        setUserName(`${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || '')
        setUserEmail(user.emailAddresses[0]?.emailAddress || '')
        setProfileImage(user.imageUrl || "/placeholder.svg?height=96&width=96")
      } finally {
        setIsLoading(false)
      }
    }

    if (isLoaded && user) {
      initializeUser()
    }
  }, [isLoaded, user])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    try {
      const reader = new FileReader()
      reader.onload = async (event) => {
        if (event.target?.result) {
          setProfileImage(event.target.result as string)
          await updateUserProfile({
            clerk_id: user.id,
            full_name: userName,
            email: userEmail,
            profile_image_url: event.target.result as string,
          })
        }
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error uploading image:', error)
    }
  }

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

  // Optimize vehicle display
  const displayVehicleInfo = () => {
    if (!vehicle) return "No vehicle added"
    return `${vehicle.year} ${vehicle.make} ${vehicle.model}`
  }

  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50">
        <MainNav />
        <main className="flex-1 container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Sidebar Skeleton */}
            <div className="hidden md:block lg:col-span-3">
              <div className="sticky top-24">
                <ProfileCardSkeleton />
              </div>
            </div>

            {/* Main Content Skeleton */}
            <div className="lg:col-span-6 space-y-6">
              <CardSkeleton />
              <CardSkeleton />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <CardSkeleton />
                <CardSkeleton />
              </div>
            </div>

            {/* Right Sidebar Skeleton */}
            <div className="hidden lg:block lg:col-span-3">
              <div className="sticky top-24 space-y-6">
                <CardSkeleton />
                <div className="space-y-4">
                  <ServiceUpdateSkeleton />
                  <ServiceUpdateSkeleton />
                  <ServiceUpdateSkeleton />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50">
      <MainNav />
      <main className="flex-1 container mx-auto px-4 py-6 animate-fadeIn">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
          {/* Left Sidebar - Sticky */}
          <div className="hidden md:block lg:col-span-3">
            <div className="sticky top-24 transform hover:scale-102 transition-transform duration-300">
              <ProfileCard
                userName={userName}
                profileImage={profileImage}
                onEditProfile={() => setIsProfileDialogOpen(true)}
                onScheduleService={() => setIsAppointmentDialogOpen(true)}
              />
            </div>
          </div>

          {/* Main Content - Scrollable */}
          <div className="lg:col-span-6 max-h-[calc(100vh-8rem)] overflow-y-auto p-6 custom-scrollbar bg-white rounded-2xl">
            <Tabs defaultValue="repairs" className="mb-6">
              <TabsList className="grid w-full grid-cols-3 mb-4 bg-black/5 backdrop-blur-sm">
                <TabsTrigger value="repairs" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-all duration-300">Current Repairs</TabsTrigger>
                <TabsTrigger value="history" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-all duration-300">Service History</TabsTrigger>
                <TabsTrigger value="updates" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-all duration-300">Service Updates</TabsTrigger>
              </TabsList>

              <TabsContent value="repairs" className="space-y-6">
                {/* Current Repair Status */}
                <Card className="overflow-hidden transform hover:shadow-xl transition-all duration-300">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-400 p-4 flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="h-3 w-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                      <h3 className="text-white font-medium">In Progress</h3>
                    </div>
                    <div className="text-blue-100">
                      <span>Updated 2h ago</span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold">Brake System Maintenance</h3>
                      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">70% Complete</Badge>
                    </div>
                    <p className="text-gray-600 mb-4">
                      Replacing brake pads and checking brake fluid levels. Additional inspection of rotors and calipers
                      for optimal performance.
                    </p>
                    <div className="grid grid-cols-3 gap-4">
                      <div
                        className="relative rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer group"
                        onClick={() => setSelectedImage("/brake1.jpg")}
                      >
                        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                        <Image
                          src="/brake1.jpg"
                          alt="Brake repair"
                          width={120}
                          height={120}
                          className="w-full h-auto object-cover"
                        />
                      </div>
                      <div
                        className="relative rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer group"
                        onClick={() => setSelectedImage("/brake2.png")}
                      >
                        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                        <Image
                          src="/brake2.png"
                          alt="Mechanic working"
                          width={120}
                          height={120}
                          className="w-full h-auto object-cover"
                        />
                      </div>
                      <div
                        className="relative rounded-lg overflow-hidden bg-gray-900 flex items-center justify-center shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => setIsVideoPlaying(true)}
                      >
                        <Play className="h-8 w-8 text-white" />
                        <div className="absolute bottom-1 right-1 text-white text-xs">0:30</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Oil Change Service */}
                <Card className="transform hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold">Oil Change Service</h3>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>
                    </div>
                    <p className="text-gray-600 mb-4">
                      Full synthetic oil change with premium filter replacement. All fluid levels checked and topped
                      off.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div
                        className="relative rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer group"
                        onClick={() => setSelectedImage("/oil1.jpeg")}
                      >
                        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                        <Image
                          src="/oil1.jpeg"
                          alt="Oil change"
                          width={120}
                          height={120}
                          className="w-full h-auto object-cover"
                        />
                      </div>
                      <div
                        className="relative rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer group"
                        onClick={() => setSelectedImage("/oil2.jpeg")}
                      >
                        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                        <Image
                          src="/oil2.jpeg"
                          alt="Mechanic working"
                          width={120}
                          height={120}
                          className="w-full h-auto object-cover"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Oil Change Service */}
                <Card className="transform hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold">Oil Change Service</h3>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>
                    </div>
                    <p className="text-gray-600 mb-4">
                      Full synthetic oil change with premium filter replacement. All fluid levels checked and topped
                      off.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div
                        className="relative rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer group"
                        onClick={() => setSelectedImage("/oil1.jpeg")}
                      >
                        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                        <Image
                          src="/oil1.jpeg"
                          alt="Oil change"
                          width={120}
                          height={120}
                          className="w-full h-auto object-cover"
                        />
                      </div>
                      <div
                        className="relative rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer group"
                        onClick={() => setSelectedImage("/oil2.jpeg")}
                      >
                        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                        <Image
                          src="/oil2.jpeg"
                          alt="Mechanic working"
                          width={120}
                          height={120}
                          className="w-full h-auto object-cover"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Oil Change Service */}
                <Card className="transform hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold">Oil Change Service</h3>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>
                    </div>
                    <p className="text-gray-600 mb-4">
                      Full synthetic oil change with premium filter replacement. All fluid levels checked and topped
                      off.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div
                        className="relative rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer group"
                        onClick={() => setSelectedImage("/oil1.jpeg")}
                      >
                        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                        <Image
                          src="/oil1.jpeg"
                          alt="Oil change"
                          width={120}
                          height={120}
                          className="w-full h-auto object-cover"
                        />
                      </div>
                      <div
                        className="relative rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer group"
                        onClick={() => setSelectedImage("/oil2.jpeg")}
                      >
                        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                        <Image
                          src="/oil2.jpeg"
                          alt="Mechanic working"
                          width={120}
                          height={120}
                          className="w-full h-auto object-cover"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

              </TabsContent>

              <TabsContent value="history">
                <Card className="transform hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <CardTitle>Service History</CardTitle>
                    <CardDescription className="text-white">View all your past service records</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center p-3 border rounded-lg hover:bg-blue-50 transition-all duration-300 transform hover:-translate-y-1">
                        <div className="bg-green-100 p-2 rounded-full mr-3">
                          <FileText className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">Full Service Maintenance</h4>
                          <p className="text-sm text-gray-500">January 15, 2025</p>
                        </div>
                        <Badge>Completed</Badge>
                      </div>

                      <div className="flex items-center p-3 border rounded-lg hover:bg-blue-50 transition-all duration-300 transform hover:-translate-y-1">
                        <div className="bg-green-100 p-2 rounded-full mr-3">
                          <FileText className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">Tire Replacement</h4>
                          <p className="text-sm text-gray-500">December 10, 2024</p>
                        </div>
                        <Badge>Completed</Badge>
                      </div>

                      <div className="flex items-center p-3 border rounded-lg hover:bg-blue-50 transition-all duration-300 transform hover:-translate-y-1">
                        <div className="bg-green-100 p-2 rounded-full mr-3">
                          <FileText className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">Oil Change</h4>
                          <p className="text-sm text-gray-500">November 5, 2024</p>
                        </div>
                        <Badge>Completed</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="updates">
                {/* Service Updates */}
                <Card className="transform hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <CardTitle>Service Updates</CardTitle>
                    <CardDescription className="text-white">Latest updates from our technicians</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border-b border-gray-100 pb-4 mb-4 my-6">
                      <div className="flex items-start">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Mike Thompson" />
                          <AvatarFallback>MT</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h4 className="font-medium">Mike Thompson</h4>
                            <span className="text-gray-500 text-sm">10:30 AM</span>
                          </div>
                          <p className="text-gray-600 mt-1">
                            Completed oil change and filter replacement. Vehicle is running smoothly now. All safety
                            checks passed.
                          </p>
                          <div className="flex items-center mt-2">
                            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 p-0 mr-4">
                              Reply
                            </Button>
                            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-600 p-0">
                              Like
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-start">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Sarah Chen" />
                          <AvatarFallback>SC</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h4 className="font-medium">Sarah Chen</h4>
                            <span className="text-gray-500 text-sm">09:15 AM</span>
                          </div>
                          <p className="text-gray-600 mt-1">
                            Diagnostic scan complete. Found minor issue with oxygen sensor. Replacement recommended
                            during next service.
                          </p>
                          <div className="flex items-center mt-2">
                            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 p-0 mr-4">
                              Reply
                            </Button>
                            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-600 p-0">
                              Like
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar - Sticky */}
          <div className="hidden md:block lg:col-span-3">
            <div className="sticky top-24 space-y-6">
              {/* Messages */}
              <Card className="transform hover:shadow-xl transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 text-white">
                  <div className="flex justify-between items-center">
                    <CardTitle>Messages</CardTitle>
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">3 New</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Link href="/messages?conversation=1" className="block">
                    <div className="p-3 m-2 rounded-lg border border-transparent hover:border-blue-200 hover:bg-blue-50 transition-all duration-300 transform">
                      <div className="flex items-start">
                        <Avatar className="h-10 w-10 mr-3 border border-blue-200">
                          <AvatarImage src="https://randomuser.me/api/portraits/men/72.jpg" alt="Service Advisor" />
                          <AvatarFallback>SA</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">Service Advisor</h4>
                          <p className="text-sm text-gray-600">Your car is ready for pickup...</p>
                          <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                        </div>
                      </div>
                    </div>
                  </Link>

                  <Link href="/messages?conversation=2" className="block">
                    <div className="p-3 rounded-lg border border-transparent hover:border-blue-200 hover:bg-blue-50 transition-all duration-300 transform ">
                      <div className="flex items-start">
                        <Avatar className="h-10 w-10 mr-3 border border-blue-200">
                          <AvatarImage src="https://lp-auto-assets.s3.amazonaws.com/service/parts-center/M3/secc1.jpg" alt="Parts Department" />
                          <AvatarFallback>PD</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">Parts Department</h4>
                          <p className="text-sm text-gray-600">Parts have arrived for your...</p>
                          <p className="text-xs text-gray-400 mt-1">Yesterday</p>
                        </div>
                      </div>
                    </div>
                  </Link>

                  <Link href="/messages">
                    <Button
                      variant="outline"
                      className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200 mt-2"
                    >
                      View All Messages
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Upcoming Services */}
              <Card className="transform hover:shadow-xl transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 text-white">
                  <CardTitle>Upcoming Services</CardTitle>
                  <CardDescription className="text-white">Your scheduled maintenance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 my-2 rounded-lg border hover:shadow-md transition-all">
                    <div className="flex items-start">
                      <div className="bg-blue-50 p-2 rounded-full mr-3">
                        <Calendar className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Scheduled Maintenance</h4>
                        <p className="text-sm text-gray-600">March 15, 2025</p>
                        <Badge variant="outline" className="mt-2">
                          Upcoming
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg border hover:shadow-md transition-all">
                    <div className="flex items-start">
                      <div className="bg-purple-50 p-2 rounded-full mr-3">
                        <Clock className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Tire Rotation</h4>
                        <p className="text-sm text-gray-600">March 28, 2025</p>
                        <Badge variant="outline" className="mt-2">
                          Upcoming
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full mt-2" onClick={() => setIsAppointmentDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule New Service
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="overflow-hidden transform hover:shadow-xl transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 text-white">
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="p-6 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 text-white">
                    <div className="mb-6 pb-6 border-b border-blue-400">
                      <p className="text-blue-100 text-sm">Next Service Due</p>
                      <div className="flex items-baseline">
                        <p className="text-white text-3xl font-bold">0</p>
                        <p className="text-blue-100 ml-2">miles</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-blue-100 text-sm">Total Services</p>
                      <div className="flex items-baseline">
                        <p className="text-white text-3xl font-bold">0</p>
                        <p className="text-blue-100 ml-2">completed</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-white">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Vehicle Health</span>
                      <span className="font-medium text-green-600">Excellent</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2 overflow-hidden">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-1000 ease-out animate-progressBar" 
                        style={{ width: "90%" }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-white to-gray-50 border-t border-gray-200 mt-6">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="transform hover:-translate-y-2 transition-transform duration-300">
              <h3 className="text-xl font-semibold mb-6 text-blue-600">Contact Us</h3>
              <div className="space-y-3 text-gray-600">
                <p className="flex items-center">
                  <span className="w-5 h-5 mr-2 text-blue-500">📍</span>
                  Becnels Automotive, LLC
                </p>
                <p className="flex items-center">
                  <span className="w-5 h-5 mr-2 text-blue-500">🏢</span>
                  1801 Newton St. New Orleans, LA 70114
                </p>
                <p className="flex items-center">
                  <span className="w-5 h-5 mr-2 text-blue-500">📞</span>
                  (504)-366-0101
                </p>
                <p className="flex items-center">
                  <span className="w-5 h-5 mr-2 text-blue-500">✉️</span>
                  service@becnels.com
                </p>
              </div>
            </div>
            <div className="transform hover:-translate-y-2 transition-transform duration-300">
              <h3 className="text-xl font-semibold mb-6 text-blue-600">Business Hours</h3>
              <div className="space-y-3 text-gray-600">
                <p className="flex items-center">
                  <span className="w-5 h-5 mr-2 text-blue-500">⏰</span>
                  Monday - Friday: 8:00 AM - 6:00 PM
                </p>
                <p className="flex items-center">
                  <span className="w-5 h-5 mr-2 text-blue-500">⏰</span>
                  Saturday: 9:00 AM - 4:00 PM
                </p>
                <p className="flex items-center">
                  <span className="w-5 h-5 mr-2 text-blue-500">⏰</span>
                  Sunday: Closed
                </p>
              </div>
            </div>
            <div className="transform hover:-translate-y-2 transition-transform duration-300">
              <h3 className="text-xl font-semibold mb-6 text-blue-600">Quick Links</h3>
              <div className="space-y-3">
                <a href="#" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-300">
                  <span className="w-5 h-5 mr-2 text-blue-500">📄</span>
              Privacy Policy
            </a>
                <a href="#" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-300">
                  <span className="w-5 h-5 mr-2 text-blue-500">📋</span>
              Terms of Service
            </a>
                <a href="#" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-300">
                  <span className="w-5 h-5 mr-2 text-blue-500">📱</span>
              Contact
            </a>
                <a href="#" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-300">
                  <span className="w-5 h-5 mr-2 text-blue-500">💼</span>
                  Careers
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-12 pt-8 text-center text-gray-500 text-sm">
            <p className="animate-fadeIn">© 2025 Becnels Automotive, LLC. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Replace direct dialog rendering with lazy loaded components */}
      <Suspense fallback={null}>
        {selectedImage && (
          <ImageDialog
            image={selectedImage}
            onClose={() => setSelectedImage(null)}
          />
        )}

        {isVideoPlaying && (
          <VideoDialog
            isOpen={isVideoPlaying}
            onClose={() => setIsVideoPlaying(false)}
          />
        )}

        {isProfileDialogOpen && (
          <ProfileDialog
            isOpen={isProfileDialogOpen}
            onClose={() => setIsProfileDialogOpen(false)}
            profileImage={profileImage}
            userName={userName}
            userEmail={userEmail}
            vehicle={displayVehicleInfo()}
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
      </Suspense>
    </div>
  )
}

