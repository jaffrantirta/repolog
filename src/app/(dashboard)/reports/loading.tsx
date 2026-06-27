import { Skeleton } from '@/components/ui/Skeleton'

export default function ReportsLoading() {
  return (
    <div className="space-y-6 font-mono">
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-44" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-7 w-32 rounded" />
      </div>
      <div className="border border-[#1a1a1a] rounded divide-y divide-[#111]">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-3 w-3" />
              <div className="space-y-1.5">
                <Skeleton className="h-3 w-52" />
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
  )
}
