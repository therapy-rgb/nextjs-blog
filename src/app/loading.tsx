export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-warm-gray-200"></div>
        <div className="h-4 w-32 rounded bg-warm-gray-200"></div>
      </div>
    </div>
  )
}
