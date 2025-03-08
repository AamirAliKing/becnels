import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AppointmentDialogProps {
  isOpen: boolean
  onClose: () => void
}

export default function AppointmentDialog({ isOpen, onClose }: AppointmentDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Schedule Service Appointment</DialogTitle>
          <DialogDescription>Book your next service appointment with our team.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="service-type" className="text-right">
              Service Type
            </Label>
            <Select defaultValue="maintenance">
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select service type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="maintenance">Regular Maintenance</SelectItem>
                <SelectItem value="oil-change">Oil Change</SelectItem>
                <SelectItem value="tire-rotation">Tire Rotation</SelectItem>
                <SelectItem value="brake-service">Brake Service</SelectItem>
                <SelectItem value="diagnostic">Diagnostic</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Date
            </Label>
            <Input id="date" type="date" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="time" className="text-right">
              Time
            </Label>
            <Select defaultValue="morning">
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="morning">Morning (8AM - 12PM)</SelectItem>
                <SelectItem value="afternoon">Afternoon (12PM - 4PM)</SelectItem>
                <SelectItem value="evening">Evening (4PM - 7PM)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notes" className="text-right">
              Notes
            </Label>
            <Textarea id="notes" placeholder="Any specific issues or concerns?" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onClose}>Book Appointment</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 