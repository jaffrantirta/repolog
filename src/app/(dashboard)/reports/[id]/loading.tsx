import { Skeleton } from '@/components/ui/Skeleton'

export default function ReportDetailLoading() {
  return (
    <div className="space-y-6">
      {/* Back + title */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-5 w-5 rounded" />
        <div className="space-y-1.5">
          <Skeleton className="h-7 w-64" />
          <Skeleton className="h-3 w-40" />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <Skeleton className="h-9 w-28 rounded-xl" />
        <Skeleton className="h-9 w-28 rounded-xl" />
      </div>

      {/* Report content blocks */}
      <div className="space-y-4">
        {/* Executive summary */}
        <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6 space-y-3">
          <Skeleton className="h-5 w-44" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
          <Skeleton className="h-3 w-4/6" />
        </div>

        {/* Activity rows */}
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6 space-y-3">
            <Skeleton className="h-5 w-36" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
