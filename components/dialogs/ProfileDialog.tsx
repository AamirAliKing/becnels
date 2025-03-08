import Link from 'next/link'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>Update your profile information.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profileImage} alt={userName} />
              <AvatarFallback>
                {userName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <Label htmlFor="picture" className="cursor-pointer text-blue-600 hover:text-blue-800">
              Change Picture
              <Input id="picture" type="file" className="hidden" accept="image/*" onChange={onImageUpload} />
            </Label>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value={userName} className="col-span-3" readOnly />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input id="email" value={userEmail} className="col-span-3" readOnly />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="vehicle" className="text-right">
              Vehicle
            </Label>
            <div className="col-span-3">
              <div className="text-sm text-gray-600">
                {vehicle}
              </div>
              <Link href="/vehicles" className="text-xs text-blue-600 hover:text-blue-800 mt-1 block">
                Manage Vehicle
              </Link>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onProfileUpdate}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 