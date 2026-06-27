import { Skeleton } from '@/components/ui/Skeleton'

export default function DashboardLoading() {
  return (
    <div className="space-y-8 font-mono">
      <div className="flex items-start justify-between">
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-48" />
          <Skeleton className="h-3 w-32" />
        </div>
        <Skeleton className="h-7 w-32 rounded" />
      </div>

      <div className="border border-[#1a1a1a] rounded p-5 space-y-4">
        <Skeleton className="h-3 w-20" />
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-7 w-8" />
            </div>
          ))}
        </div>
        <Skeleton className="h-3 w-40" />
        <Skeleton className="h-3 w-full" />
      </div>

      <div className="border border-[#1a1a1a] rounded p-5 space-y-2">
        <Skeleton className="h-3 w-36" />
        <Skeleton className="h-3 w-64" />
        <Skeleton className="h-3 w-48" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-3 w-28" />
        <div className="border border-[#1a1a1a] rounded divide-y divide-[#111]">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-3 w-3" />
                <div className="space-y-1.5">
                  <Skeleton className="h-3 w-48" />
                  <Skeleton className="h-2.5 w-36" />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Skeleton className="h-3 w-14" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
