export default function MeetingsLoading() {
  return (
    <div className="p-6 h-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {/* Calendar Skeleton */}
        <div className="lg:col-span-2">
          <div className="animate-pulse bg-white rounded-lg border p-6 h-full">
            <div className="flex items-center justify-between mb-6">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="flex gap-2">
                <div className="h-8 w-8 bg-gray-200 rounded"></div>
                <div className="h-8 w-8 bg-gray-200 rounded"></div>
                <div className="h-8 w-24 bg-gray-200 rounded"></div>
              </div>
            </div>

            {/* Calendar Grid Skeleton */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="h-8 bg-gray-200 rounded"></div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {[...Array(42)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Skeleton */}
        <div className="space-y-4">
          <div className="animate-pulse bg-white rounded-lg border p-4">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>

          <div className="animate-pulse bg-white rounded-lg border p-4">
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
