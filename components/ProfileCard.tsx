import { Car, Edit } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

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

interface ProfileCardProps {
  userName: string
  profileImage: string
  onEditProfile: () => void
  onScheduleService: () => void
}

export function ProfileCard({
  userName,
  profileImage,
  onEditProfile,
  onScheduleService,
}: ProfileCardProps) {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)

  useEffect(() => {
    const loadVehicle = async () => {
      try {
        const savedVehicle = localStorage.getItem('vehicle')
        if (savedVehicle) {
          setVehicle(JSON.parse(savedVehicle))
        }
      } catch (error) {
        console.error('Error loading vehicle:', error)
      }
    }
    loadVehicle()
  }, [])

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-6">
        <div className="flex justify-between items-start">
          <CardTitle>Profile</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-blue-700 rounded-full h-8 w-8"
            onClick={onEditProfile}
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription className="text-blue-100">Manage your account</CardDescription>
      </CardHeader>
      <CardContent className="p-6 flex flex-col items-center">
        <div className="relative mb-4">
          <Avatar className="h-24 w-24 border-4 border-white shadow-lg -mt-12">
            <AvatarImage src={profileImage} alt={userName} />
            <AvatarFallback>
              {userName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="absolute bottom-1 right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
        <h2 className="text-xl font-bold mt-2">{userName}</h2>
        <div className="flex items-center text-gray-600 mt-1 mb-4">
          <Car className="h-4 w-4 mr-1" />
          <span>{vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : "No Vehicle Added"}</span>
        </div>
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 transition-all"
          onClick={onScheduleService}
        >
          Schedule Service
        </Button>
      </CardContent>
      <Separator />
      <CardContent className="p-6">
        <h3 className="font-bold text-lg mb-4">Quick Links</h3>
      </CardContent>
    </Card>
  )
} 