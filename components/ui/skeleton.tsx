import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-2xl bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 background-animate",
        className
      )}
      {...props}
    />
  )
}

// Card skeleton for consistent loading states
function CardSkeleton() {
  return (
    <div className="rounded-2xl border bg-card">
      <div className="h-[120px] rounded-t-2xl bg-gradient-to-r from-blue-600/80 to-blue-500/80 animate-pulse" />
      <div className="p-6">
        <Skeleton className="h-6 w-1/2 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  )
}

// Profile card skeleton
function ProfileCardSkeleton() {
  return (
    <div className="rounded-2xl border bg-card">
      <div className="h-[100px] rounded-t-2xl bg-gradient-to-r from-blue-600/80 to-blue-500/80 animate-pulse" />
      <div className="p-6 flex flex-col items-center">
        <div className="h-24 w-24 rounded-full bg-gray-200 animate-pulse -mt-16 border-4 border-white" />
        <Skeleton className="h-6 w-32 mt-4 mb-2" />
        <Skeleton className="h-4 w-40 mb-6" />
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>
    </div>
  )
}

// Message skeleton for chat/message lists
function MessageSkeleton() {
  return (
    <div className="flex items-start space-x-4 p-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-[120px]" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  )
}

// Service update skeleton
function ServiceUpdateSkeleton() {
  return (
    <div className="border-b border-gray-100 pb-4 mb-4">
      <div className="flex items-start space-x-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1">
          <div className="flex justify-between">
            <Skeleton className="h-5 w-32 mb-2" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  )
}

export { Skeleton, CardSkeleton, ProfileCardSkeleton, MessageSkeleton, ServiceUpdateSkeleton } 