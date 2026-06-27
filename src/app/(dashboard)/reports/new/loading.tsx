import { Skeleton } from '@/components/ui/Skeleton'

export default function NewReportLoading() {
  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-56" />
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton className="h-7 w-7 rounded-full" />
            {i < 3 && <Skeleton className="h-px w-8" />}
          </div>
        ))}
      </div>

      {/* Form card */}
      <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6 space-y-5">
        <Skeleton className="h-5 w-32" />
        <div className="space-y-3">
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>
    </div>
  )
}
