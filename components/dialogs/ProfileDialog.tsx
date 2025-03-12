import Link from 'next/link'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion } from "framer-motion"
import { useState } from "react"

interface ProfileDialogProps {
  isOpen: boolean
  onClose: () => void
  profileImage: string
  userName: string
  userEmail: string
  vehicle: string
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  onProfileUpdate: () => void
}

export default function ProfileDialog({
  isOpen,
  onClose,
  profileImage,
  userName,
  userEmail,
  vehicle,
  onImageUpload,
  onProfileUpdate,
}: ProfileDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl p-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <DialogHeader className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-6">
            <DialogTitle className="text-2xl font-bold">Edit Profile</DialogTitle>
            <DialogDescription className="text-blue-100">
              Update your profile information.
            </DialogDescription>
          </DialogHeader>
          <div className="p-6">
            <div className="grid gap-6">
              <motion.div 
                className="flex flex-col items-center gap-4"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Avatar className="h-24 w-24 border-4 border-white shadow-lg transition-transform duration-200 hover:scale-105">
                  <AvatarImage src={profileImage} alt={userName} />
                  <AvatarFallback className="text-xl">
                    {userName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <Label 
                  htmlFor="picture" 
                  className="cursor-pointer text-blue-600 hover:text-blue-800 transition-colors duration-200"
                >
                  Change Picture
                  <Input 
                    id="picture" 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={onImageUpload} 
                  />
                </Label>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right font-medium">
                    Name
                  </Label>
                  <Input 
                    id="name" 
                    value={userName} 
                    className="col-span-3 rounded-xl" 
                    readOnly 
                  />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right font-medium">
                    Email
                  </Label>
                  <Input 
                    id="email" 
                    value={userEmail} 
                    className="col-span-3 rounded-xl" 
                    readOnly 
                  />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="vehicle" className="text-right font-medium">
                    Vehicle
                  </Label>
                  <div className="col-span-3">
                    <div className="text-sm text-gray-600">
                      {vehicle}
                    </div>
                    <Link 
                      href="/vehicles" 
                      className="text-xs text-blue-600 hover:text-blue-800 mt-1 block transition-colors duration-200"
                    >
                      Manage Vehicle
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
          <DialogFooter className="p-6 bg-gray-50">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="rounded-xl transition-all duration-200 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button 
              onClick={onProfileUpdate}
              className="rounded-xl bg-blue-600 hover:bg-blue-700 transition-all duration-200"
            >
              Save changes
            </Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
} 