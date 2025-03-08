"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Bell, Car, ChevronDown, FilePen, Key, Pencil, Plus, Trash, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserButton, useUser } from "@clerk/nextjs"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"

// Define the vehicle interface
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

export default function VehiclesPage() {
  // State for vehicle
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)

  // Load vehicle from AsyncStorage on component mount
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

  // Save vehicle to AsyncStorage whenever it changes
  useEffect(() => {
    const saveVehicle = async () => {
      try {
        if (vehicle) {
          localStorage.setItem('vehicle', JSON.stringify(vehicle))
        } else {
          localStorage.removeItem('vehicle')
        }
      } catch (error) {
        console.error('Error saving vehicle:', error)
      }
    }
    saveVehicle()
  }, [vehicle])

  // State for new/edit vehicle form
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewMode, setIsViewMode] = useState(false)

  // Form state
  const [formData, setFormData] = useState<
    Omit<Vehicle, "id" | "images"> & { id?: string; images?: string[] }
  >({
    make: "",
    model: "",
    year: "",
    color: "",
    vin: "",
    licensePlate: "",
    mileage: "",
    purchaseDate: "",
    notes: "",
  })

  // Image upload state
  const [vehicleImages, setVehicleImages] = useState<string[]>([])
  const [newImage, setNewImage] = useState<string | null>(null)

  // Set a vehicle as primary
  const setAsPrimary = (id: string) => {
    setVehicle(
      vehicle => ({
        ...vehicle,
        isPrimary: vehicle.id === id,
      })
    )
  }

  // Delete a vehicle
  const deleteVehicle = () => {
    setVehicle(null)
    setIsEditDialogOpen(false)
  }

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setNewImage(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  // Add the new image to the vehicle images
  const addNewImage = () => {
    if (newImage) {
      setVehicleImages([...vehicleImages, newImage])
      setNewImage(null)
    }
  }

  // Remove an image
  const removeImage = (index: number) => {
    setVehicleImages(vehicleImages.filter((_, i) => i !== index))
  }

  // Open the edit dialog for a new vehicle
  const openNewVehicleDialog = () => {
    setFormData({
      make: "",
      model: "",
      year: "",
      color: "",
      vin: "",
      licensePlate: "",
      mileage: "",
      purchaseDate: "",
      notes: "",
    })
    setVehicleImages([])
    setVehicle(null)
    setIsViewMode(false)
    setIsEditDialogOpen(true)
  }

  // Open the edit dialog for an existing vehicle
  const openEditVehicleDialog = (vehicle: Vehicle) => {
    setFormData({
      ...vehicle,
    })
    setVehicleImages([...vehicle.images])
    setVehicle(vehicle)
    setIsViewMode(false)
    setIsEditDialogOpen(true)
  }

  // Open the view dialog for a vehicle
  const openViewVehicleDialog = (vehicle: Vehicle) => {
    setFormData({
      ...vehicle,
    })
    setVehicleImages([...vehicle.images])
    setVehicle(vehicle)
    setIsViewMode(true)
    setIsEditDialogOpen(true)
  }

  // Save the vehicle (create or update)
  const saveVehicle = () => { 
    const updatedVehicle: Vehicle = {
      id: vehicle?.id || Date.now().toString(),
      make: formData.make || "",
      model: formData.model || "",
      year: formData.year || "",
      color: formData.color || "",
      vin: formData.vin || "",
      licensePlate: formData.licensePlate || "",
      mileage: formData.mileage || "",
      images: vehicleImages,
      purchaseDate: formData.purchaseDate,
      lastService: vehicle?.lastService,
      notes: formData.notes,
    }
    setVehicle(updatedVehicle)
    setIsEditDialogOpen(false)
  }

  // Generate years for dropdown (from 1990 to current year)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: currentYear - 1989 }, (_, i) => (currentYear - i).toString())

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
      <Image alt="logo" src="/logo.png" className="w-14 font-bold text-blue-600" width={20} height={20}/>
      <h1 className="text-xl font-bold text-blue-600 ml-6">Becnels Automotive, LLC</h1>
      </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/" className="ont-medium text-gray-500 hover:text-gray-900 hover:border-b-2 hover:border-blue-600 pb-1 transition-all">
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
              className="ont-medium text-gray-900 border-b-2 border-blue-600 pb-1"
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

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Vehicles</h1>
            <p className="text-gray-600">Manage your vehicles and keep track of their details</p>
          </div>
          <Button onClick={openNewVehicleDialog} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" /> Add New Vehicle
          </Button>
        </div>

        {vehicle === null ? (
          <Card className="p-12 text-center">
            <div className="flex flex-col items-center">
              <Car className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">No Vehicle Added</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Add your vehicle to track its service history, receive maintenance reminders, and manage all your
                automotive needs in one place.
              </p>
              <Button onClick={openNewVehicleDialog} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" /> Add Your Vehicle
              </Button>
            </div>
          </Card>
        ) : (
          <div className="max-w-2xl mx-auto">
            <Card className="overflow-hidden">
              <div className="relative">
                <Image
                  src={vehicle.images[0] || "/placeholder.svg?height=200&width=400"}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover"
                />
              </div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </CardTitle>
                    <CardDescription>
                      License: {vehicle.licensePlate} • Mileage: {vehicle.mileage}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>Vehicle Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => openViewVehicleDialog(vehicle)}>
                        <Car className="mr-2 h-4 w-4" /> View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openEditVehicleDialog(vehicle)}>
                        <Pencil className="mr-2 h-4 w-4" /> Edit Vehicle
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600" onClick={deleteVehicle}>
                        <Trash className="mr-2 h-4 w-4" /> Delete Vehicle
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <Key className="h-4 w-4 mr-1 text-gray-400" />
                  <span className="font-medium mr-1">VIN:</span>
                  <span className="truncate">{vehicle.vin}</span>
                </div>
                {vehicle.notes && <p className="text-sm text-gray-600 mt-2 line-clamp-2">{vehicle.notes}</p>}
              </CardContent>
              <CardFooter className="flex justify-between pt-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openViewVehicleDialog(vehicle)}
                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  View Details
                </Button>
                <Button variant="ghost" size="sm" onClick={() => openEditVehicleDialog(vehicle)}>
                  Edit
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-6">
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

      {/* Vehicle Edit/Add/View Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {isViewMode
                ? `${vehicle?.year} ${vehicle?.make} ${vehicle?.model}`
                : vehicle
                  ? "Edit Vehicle"
                  : "Add New Vehicle"}
            </DialogTitle>
            <DialogDescription>
              {isViewMode
                ? "Vehicle details and information"
                : vehicle
                  ? "Update your vehicle's information"
                  : "Enter your vehicle's details"}
            </DialogDescription>
          </DialogHeader>

          {isViewMode ? (
            // Vehicle View Mode
            <div className="space-y-6">
              {/* Vehicle Images */}
              <div>
                <Label className="text-sm font-medium">Vehicle Images</Label>
                <div className="mt-2 grid grid-cols-3 gap-3">
                  {vehicleImages.map((image, index) => (
                    <div key={index} className="relative rounded-md overflow-hidden h-24">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt="Vehicle"
                        width={100}
                        height={100}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Tabs defaultValue="details">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="details">Vehicle Details</TabsTrigger>
                  <TabsTrigger value="service">Service History</TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <div>
                      <Label className="text-sm text-gray-500">Make</Label>
                      <p className="font-medium">{formData.make}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">Model</Label>
                      <p className="font-medium">{formData.model}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">Year</Label>
                      <p className="font-medium">{formData.year}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">Color</Label>
                      <p className="font-medium">{formData.color}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">VIN</Label>
                      <p className="font-medium">{formData.vin}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">License Plate</Label>
                      <p className="font-medium">{formData.licensePlate}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">Current Mileage</Label>
                      <p className="font-medium">{formData.mileage}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">Purchase Date</Label>
                      <p className="font-medium">{formData.purchaseDate || "Not specified"}</p>
                    </div>
                  </div>

                  {formData.notes && (
                    <div>
                      <Label className="text-sm text-gray-500">Notes</Label>
                      <p className="mt-1">{formData.notes}</p>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="service" className="pt-4">
                  <div className="text-center py-8">
                    <Car className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">No Service Records Yet</h3>
                    <p className="text-gray-500 mb-4">Service records will appear here once available</p>
                    <Button variant="outline" className="mx-auto">
                      Schedule Service
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            // Vehicle Edit Mode
            <div className="grid gap-4 py-4">
              <Tabs defaultValue="basic">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="advanced">Additional Details</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4 pt-4">
                  {/* Basic Vehicle Information */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="make">Make</Label>
                      <Input
                        id="make"
                        name="make"
                        value={formData.make}
                        onChange={handleInputChange}
                        placeholder="e.g. Toyota"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="model">Model</Label>
                      <Input
                        id="model"
                        name="model"
                        value={formData.model}
                        onChange={handleInputChange}
                        placeholder="e.g. Camry"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="year">Year</Label>
                      <Select value={formData.year} onValueChange={(value) => handleSelectChange("year", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          {years.map((year) => (
                            <SelectItem key={year} value={year}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="color">Color</Label>
                      <Input
                        id="color"
                        name="color"
                        value={formData.color}
                        onChange={handleInputChange}
                        placeholder="e.g. Black"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vin">VIN (Vehicle Identification Number)</Label>
                    <Input
                      id="vin"
                      name="vin"
                      value={formData.vin}
                      onChange={handleInputChange}
                      placeholder="e.g. 1HGBH41JXMN109186"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="licensePlate">License Plate</Label>
                      <Input
                        id="licensePlate"
                        name="licensePlate"
                        value={formData.licensePlate}
                        onChange={handleInputChange}
                        placeholder="e.g. ABC123"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mileage">Current Mileage</Label>
                      <Input
                        id="mileage"
                        name="mileage"
                        value={formData.mileage}
                        onChange={handleInputChange}
                        placeholder="e.g. 25,000"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="advanced" className="space-y-4 pt-4">
                  {/* Additional Vehicle Information */}
                  <div className="space-y-2">
                    <Label htmlFor="purchaseDate">Purchase Date</Label>
                    <Input
                      id="purchaseDate"
                      name="purchaseDate"
                      type="date"
                      value={formData.purchaseDate}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes & Features</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Optional notes about your vehicle, special features, etc."
                      className="min-h-[100px]"
                    />
                  </div>

                  {/* Vehicle Images */}
                  <div className="space-y-2">
                    <Label>Vehicle Images</Label>

                    <div className="grid grid-cols-3 gap-3 mt-2">
                      {vehicleImages.map((image, index) => (
                        <div key={index} className="relative rounded-md overflow-hidden h-24">
                          <Image
                            src={image || "/placeholder.svg"}
                            alt="Vehicle"
                            width={100}
                            height={100}
                            className="w-full h-full object-cover"
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6 rounded-full"
                            onClick={() => removeImage(index)}
                          >
                            <Trash className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}

                      {!newImage && (
                        <div className="border-2 border-dashed border-gray-200 rounded-md flex items-center justify-center h-24 cursor-pointer hover:border-blue-500 transition-colors">
                          <Label htmlFor="image-upload" className="cursor-pointer text-center p-2">
                            <Upload className="h-6 w-6 mx-auto text-gray-400 mb-1" />
                            <span className="text-xs text-gray-500">Add Image</span>
                            <Input
                              id="image-upload"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleImageUpload}
                            />
                          </Label>
                        </div>
                      )}
                    </div>

                    {newImage && (
                      <div className="mt-4">
                        <div className="relative rounded-md overflow-hidden h-48 mb-2">
                          <Image
                            src={newImage || "/placeholder.svg"}
                            alt="New vehicle"
                            width={300}
                            height={200}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex space-x-2">
                          <Button type="button" variant="outline" className="flex-1" onClick={() => setNewImage(null)}>
                            Cancel
                          </Button>
                          <Button type="button" className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={addNewImage}>
                            Add Image
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              {isViewMode ? "Close" : "Cancel"}
            </Button>
            {!isViewMode && (
              <Button onClick={saveVehicle} className="bg-blue-600 hover:bg-blue-700">
                {vehicle ? "Update Vehicle" : "Add Vehicle"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

