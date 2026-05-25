export function CakeLoadingState({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 bg-gray-200 rounded-lg w-1/3 max-w-xs" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-28 bg-white border border-gray-100 rounded-2xl" />
        ))}
      </div>
      <div className="h-64 bg-white border border-gray-100 rounded-2xl" />
    </div>
  );
}

export function CakeErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 text-red-800 p-6">
      <p className="font-semibold">Something went wrong</p>
      <p className="text-sm mt-1">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 text-sm font-medium text-red-700 underline hover:no-underline"
        >
          Try again
        </button>
      ) : null}
    </div>
  );
}
