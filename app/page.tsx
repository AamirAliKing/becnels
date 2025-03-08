"use client"

import type React from "react"
import dynamic from 'next/dynamic'
import Link from "next/link"
import { useState, useEffect } from "react"
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

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Header } from "@/components/Header"
import { ProfileCard } from "@/components/ProfileCard"

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
  const [profileImage, setProfileImage] = useState("/placeholder.svg?height=96&width=96")
  const [userName, setUserName] = useState("Demo User")
  const [userEmail, setUserEmail] = useState("demo@example.com")
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false)
  const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Load vehicle data from localStorage
    const savedVehicle = localStorage.getItem('vehicle')
    if (savedVehicle) {
      setVehicle(JSON.parse(savedVehicle))
    }
  }, [])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const reader = new FileReader()
      reader.onload = async (event) => {
        if (event.target?.result) {
          setProfileImage(event.target.result as string)
          // Save to localStorage
          localStorage.setItem('profileImage', event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error uploading image:', error)
    }
  }

  const handleProfileUpdate = async () => {
    try {
      // Save to localStorage
      localStorage.setItem('userName', userName)
      localStorage.setItem('userEmail', userEmail)
      localStorage.setItem('profileImage', profileImage)
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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-6 animate-fadeIn">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3 transform hover:scale-102 transition-transform duration-300">
            <ProfileCard
              userName={userName}
              profileImage={profileImage}
              onEditProfile={() => setIsProfileDialogOpen(true)}
              onScheduleService={() => setIsAppointmentDialogOpen(true)}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-6">
            <Tabs defaultValue="repairs" className="mb-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="repairs">Repairs</TabsTrigger>
                <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
              <TabsContent value="repairs">
                <Card>
                  <CardHeader>
                    <CardTitle>Current Repairs</CardTitle>
                    <CardDescription>View and track your vehicle repairs</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-blue-100 rounded-full">
                            <Car className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">{displayVehicleInfo()}</h3>
                            <p className="text-sm text-gray-500">Status: In Progress</p>
                          </div>
                        </div>
                        <Badge>Active</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="maintenance">
                <Card>
                  <CardHeader>
                    <CardTitle>Maintenance Schedule</CardTitle>
                    <CardDescription>Keep your vehicle in top condition</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-green-100 rounded-full">
                            <Clock className="h-6 w-6 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">Oil Change Due</h3>
                            <p className="text-sm text-gray-500">Every 5,000 miles</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Schedule</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="history">
                <Card>
                  <CardHeader>
                    <CardTitle>Service History</CardTitle>
                    <CardDescription>View past services and repairs</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-purple-100 rounded-full">
                            <History className="h-6 w-6 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">Brake Replacement</h3>
                            <p className="text-sm text-gray-500">Completed on March 1, 2025</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">Details</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Service</CardTitle>
                <CardDescription>Next scheduled maintenance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Oil Change</p>
                      <p className="text-sm text-gray-500">March 15, 2025</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Recent updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Bell className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Service Reminder</p>
                      <p className="text-sm text-gray-500">Oil change due in 500 miles</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Dialogs */}
      <ProfileDialog
        open={isProfileDialogOpen}
        onOpenChange={setIsProfileDialogOpen}
        userName={userName}
        setUserName={setUserName}
        userEmail={userEmail}
        setUserEmail={setUserEmail}
        profileImage={profileImage}
        onImageUpload={handleImageUpload}
        onSave={handleProfileUpdate}
      />

      <AppointmentDialog
        open={isAppointmentDialogOpen}
        onOpenChange={setIsAppointmentDialogOpen}
      />

      <ImageDialog
        open={!!selectedImage}
        onOpenChange={() => setSelectedImage(null)}
        src={selectedImage || ''}
      />

      <VideoDialog
        open={isVideoPlaying}
        onOpenChange={setIsVideoPlaying}
      />
    </div>
  )
}
