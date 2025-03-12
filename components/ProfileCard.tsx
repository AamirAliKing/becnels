import { Car, Edit } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { motion } from "framer-motion"

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
    <Card className="overflow-hidden rounded-2xl shadow-sm transition-all duration-200 hover:shadow-xl">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-8 relative">
        <motion.div 
          className="flex justify-between items-start"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <CardTitle className="text-2xl">Profile</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-blue-700/50 rounded-xl h-9 w-9 transition-all duration-200"
            onClick={onEditProfile}
          >
            <Edit className="h-5 w-5" />
          </Button>
        </motion.div>
        <CardDescription className="text-blue-100 mt-2">Manage your account</CardDescription>
      </CardHeader>
      <CardContent className="p-8 flex flex-col items-center">
        <motion.div 
          className="relative mb-6"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Avatar className="h-28 w-28 border-4 border-white shadow-xl -mt-20 transition-transform duration-200 hover:scale-105">
            <AvatarImage src={profileImage} alt={userName} />
            <AvatarFallback className="text-2xl">
              {userName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <motion.div 
            className="absolute bottom-1 right-1 h-5 w-5 bg-green-500 rounded-full border-2 border-white"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2, delay: 0.3 }}
          />
        </motion.div>
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-2">{userName}</h2>
          <div className="flex items-center justify-center text-gray-600 mb-6">
            <Car className="h-5 w-5 mr-2" />
            <span className="text-sm">
              {vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : "No Vehicle Added"}
            </span>
          </div>
        </motion.div>
        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-200 rounded-xl h-11 text-base font-medium shadow-md hover:shadow-lg active:scale-95"
            onClick={onScheduleService}
          >
            Schedule Service
          </Button>
        </motion.div>
      </CardContent>
      <Separator className="my-2" />
      <CardContent className="p-6">
        <motion.h3 
          className="font-bold text-lg mb-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          Quick Links
        </motion.h3>
      </CardContent>
    </Card>
  )
} 