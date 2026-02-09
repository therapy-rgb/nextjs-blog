export default function JournalLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="h-12 w-48 bg-warm-gray-200 rounded animate-pulse mb-20"></div>
      <div className="space-y-12">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col md:flex-row md:gap-x-8">
            <div className="flex items-baseline gap-3 mb-4 md:mb-0 md:w-[260px] md:flex-shrink-0">
              {i === 1 && <div className="h-10 w-[7rem] bg-warm-gray-200 rounded animate-pulse"></div>}
              {i !== 1 && <div className="min-w-[7rem]"></div>}
              <div className="h-6 w-24 bg-warm-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="flex-1 border-b border-warm-gray-200 pb-8">
              <div className="flex justify-between items-baseline gap-4 mb-2">
                <div className="h-7 w-2/3 bg-warm-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-32 bg-warm-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="h-4 w-full bg-warm-gray-200 rounded animate-pulse mt-3"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
