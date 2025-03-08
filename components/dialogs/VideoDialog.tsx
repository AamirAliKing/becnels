import { Dialog, DialogContent } from "@/components/ui/dialog"

interface VideoDialogProps {
  isOpen: boolean
  onClose: () => void
}

export default function VideoDialog({ isOpen, onClose }: VideoDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] p-1">
        <div className="relative w-full h-0 pb-[56.25%]">
          <iframe
            className="absolute top-0 left-0 w-full h-full rounded-md"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
            title="Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </DialogContent>
    </Dialog>
  )
} 