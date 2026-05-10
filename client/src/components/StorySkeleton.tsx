import { Card } from "@/components/ui/card";

export function StorySkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Cover Image Skeleton */}
      <div className="h-96 bg-slate-800 rounded-lg"></div>

      {/* Title Section Skeleton */}
      <Card className="bg-slate-900/50 border-slate-700/50 p-6">
        <div className="space-y-3">
          <div className="h-8 bg-slate-700 rounded w-3/4"></div>
          <div className="flex gap-2">
            <div className="h-6 bg-slate-700 rounded w-20"></div>
            <div className="h-6 bg-slate-700 rounded w-24"></div>
            <div className="h-6 bg-slate-700 rounded w-16"></div>
          </div>
        </div>
      </Card>

      {/* Content Sections Skeleton */}
      {[1, 2, 3, 4, 5].map((i) => (
        <Card key={i} className="bg-slate-900/50 border-slate-700/50 p-6">
          <div className="space-y-3">
            <div className="h-6 bg-slate-700 rounded w-24"></div>
            <div className="space-y-2">
              <div className="h-4 bg-slate-700 rounded"></div>
              <div className="h-4 bg-slate-700 rounded"></div>
              <div className="h-4 bg-slate-700 rounded w-5/6"></div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export function StoryHistorySkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="space-y-4 animate-pulse">
        <div className="h-10 bg-slate-700 rounded w-1/3"></div>
        <div className="h-10 bg-slate-800 rounded"></div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="bg-slate-900/50 border-slate-700/50 overflow-hidden">
            <div className="h-40 bg-slate-800"></div>
            <div className="p-4 space-y-3">
              <div className="h-6 bg-slate-700 rounded w-4/5"></div>
              <div className="flex gap-2">
                <div className="h-5 bg-slate-700 rounded w-16"></div>
                <div className="h-5 bg-slate-700 rounded w-20"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-slate-700 rounded"></div>
                <div className="h-4 bg-slate-700 rounded w-5/6"></div>
              </div>
              <div className="h-4 bg-slate-700 rounded w-24"></div>
              <div className="flex gap-2">
                <div className="h-8 bg-slate-700 rounded flex-1"></div>
                <div className="h-8 bg-slate-700 rounded w-10"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div key={i} className="space-y-2">
          <div className="h-5 bg-slate-700 rounded w-24"></div>
          <div className="h-10 bg-slate-800 rounded"></div>
        </div>
      ))}
      <div className="h-12 bg-slate-700 rounded"></div>
    </div>
  );
}
