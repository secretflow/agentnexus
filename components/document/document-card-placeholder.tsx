export function DocumentCardPlaceholder() {
  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex grow items-center gap-3">
        <div className="hidden h-8 w-8 animate-pulse rounded-full bg-gray-200 sm:block" />
        <div className="flex h-10 flex-col justify-center gap-x-2 gap-y-1 transition-[height]">
          <div className="h-5 w-32 animate-pulse rounded-md bg-gray-200 sm:w-44" />
          <div className="h-4 w-28 animate-pulse rounded-md bg-gray-200" />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="h-6 w-12 animate-pulse rounded-md bg-gray-200" />
        <div className="hidden h-6 w-12 animate-pulse rounded-md bg-gray-200 sm:block" />
      </div>
    </div>
  );
}
