export default function JournalLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="h-10 w-48 bg-warm-gray-200 rounded animate-pulse mb-8"></div>
      <div className="space-y-12">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border-b border-warm-gray-200 pb-12">
            <div className="h-4 w-24 bg-warm-gray-200 rounded animate-pulse mb-3"></div>
            <div className="h-8 w-3/4 bg-warm-gray-200 rounded animate-pulse mb-4"></div>
            <div className="h-4 w-full bg-warm-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-2/3 bg-warm-gray-200 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  )
}
