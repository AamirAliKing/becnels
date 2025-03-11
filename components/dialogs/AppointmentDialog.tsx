import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"

interface AppointmentDialogProps {
  isOpen: boolean
  onClose: () => void
}

export default function AppointmentDialog({ isOpen, onClose }: AppointmentDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px] rounded-2xl p-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <DialogHeader className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-6">
            <DialogTitle className="text-2xl font-bold">Schedule Service Appointment</DialogTitle>
            <DialogDescription className="text-blue-100">
              Book your next service appointment with our team.
            </DialogDescription>
          </DialogHeader>
          <div className="p-6">
            <div className="grid gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="service-type" className="text-right font-medium">
                    Service Type
                  </Label>
                  <Select defaultValue="maintenance">
                    <SelectTrigger className="col-span-3 rounded-xl">
                      <SelectValue placeholder="Select service type" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="maintenance">Regular Maintenance</SelectItem>
                      <SelectItem value="oil-change">Oil Change</SelectItem>
                      <SelectItem value="tire-rotation">Tire Rotation</SelectItem>
                      <SelectItem value="brake-service">Brake Service</SelectItem>
                      <SelectItem value="diagnostic">Diagnostic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right font-medium">
                    Date
                  </Label>
                  <Input 
                    id="date" 
                    type="date" 
                    className="col-span-3 rounded-xl" 
                  />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="time" className="text-right font-medium">
                    Time
                  </Label>
                  <Select defaultValue="morning">
                    <SelectTrigger className="col-span-3 rounded-xl">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="morning">Morning (8AM - 12PM)</SelectItem>
                      <SelectItem value="afternoon">Afternoon (12PM - 4PM)</SelectItem>
                      <SelectItem value="evening">Evening (4PM - 7PM)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="notes" className="text-right font-medium">
                    Notes
                  </Label>
                  <Textarea 
                    id="notes" 
                    placeholder="Any specific issues or concerns?" 
                    className="col-span-3 rounded-xl min-h-[100px]" 
                  />
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
              onClick={onClose}
              className="rounded-xl bg-blue-600 hover:bg-blue-700 transition-all duration-200"
            >
              Book Appointment
            </Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
} 