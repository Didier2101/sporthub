export default function HomeLoading() {
    return (
        <div className="p-4 space-y-6 animate-pulse">
            {/* Header skeleton */}
            <div className="h-24 bg-gray-200 rounded-xl"></div>

            {/* Feed skeleton */}
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-32"></div>
                                <div className="h-3 bg-gray-200 rounded w-24"></div>
                            </div>
                        </div>
                        <div className="h-48 bg-gray-100 rounded-lg"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}