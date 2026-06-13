export default function Loading() {
  return (
    <div className="flex-1 w-full flex items-center justify-center p-8 min-h-[60vh]">
      <div className="w-full max-w-4xl space-y-8 animate-pulse">
        {/* Header Skeleton */}
        <div className="h-12 bg-gray-200 rounded-2xl w-1/3"></div>
        
        {/* Content Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col space-y-4">
              <div className="h-48 bg-gray-200 rounded-3xl w-full"></div>
              <div className="h-6 bg-gray-200 rounded-lg w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded-lg w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
