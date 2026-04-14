"use client"

const MessagingSkeleton = () => {
  return (
    <div className="space-y-4 animate-pulse">
      {[...Array(4)].map((_, i) => {
        const isRight = i % 2 === 0; // alternate left/right

        return (
          <div
            key={i}
            className={`flex items-end gap-2 ${
              isRight ? "justify-end" : "justify-start"
            }`}
          >
            {!isRight && (
              <div className="w-8 h-8 rounded-full bg-gray-300" />
            )}

            <div className="flex flex-col gap-1 max-w-[60%]">
              <div className="Skeleton h-3 w-60 bg-gray-300 rounded" />
              <div className="h-10 bg-gray-300 rounded-lg" />
              <div className="h-3 w-12 bg-gray-200 rounded" />
            </div>

            {isRight && (
              <div className="w-8 h-8 rounded-full bg-gray-300" />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MessagingSkeleton;