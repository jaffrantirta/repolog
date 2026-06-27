import { Skeleton } from '@/components/ui/Skeleton'

export default function SettingsLoading() {
  return (
    <div className="max-w-2xl space-y-5 font-mono">
      <div className="space-y-1.5">
        <Skeleton className="h-3 w-44" />
        <Skeleton className="h-3 w-56" />
      </div>
      <div className="border border-[#1a1a1a] rounded p-5 space-y-4">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-2.5 w-64" />
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-2.5 w-20" />
              <Skeleton className="h-8 w-full rounded" />
            </div>
          ))}
        </div>
      </div>
      <div className="border border-[#1a1a1a] rounded p-5 space-y-4">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-2.5 w-72" />
        <div className="space-y-2">
          <Skeleton className="h-2.5 w-16" />
          <Skeleton className="h-8 w-full rounded" />
        </div>
      </div>
      <Skeleton className="h-8 w-32 rounded" />
    </div>
  )
}
