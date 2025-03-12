import { Dialog, DialogContent } from "@/components/ui/dialog"

interface VideoDialogProps {
  isOpen: boolean
  onClose: () => void
}

export default function VideoDialog({ isOpen, onClose }: VideoDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <video controls autoPlay className="w-full rounded-lg">
          <source src="/repair-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </DialogContent>
    </Dialog>
  )
} 