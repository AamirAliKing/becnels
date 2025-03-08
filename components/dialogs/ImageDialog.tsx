import Image from 'next/image'
import { Dialog, DialogContent } from "@/components/ui/dialog"

interface ImageDialogProps {
  image: string
  onClose: () => void
}

export default function ImageDialog({ image, onClose }: ImageDialogProps) {
  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[800px] p-1">
        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            src={image}
            alt="Enlarged view"
            width={800}
            height={600}
            className="w-full h-auto object-contain rounded-md"
            priority
            quality={100}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
} 