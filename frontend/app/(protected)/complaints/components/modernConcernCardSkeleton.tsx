"use client";

const ModernConcernCardSkeleton = () => {
    const skeletons = Array.from({ length: 4 }).map((_, index) => index);
  return (
    <>
    { skeletons.map((index) => (
        <div key={index} className="max-w-3xl w-full border-t-2 border-t-slate-300 border-b-slate-300 border-b-2 card relative mx-auto bg-base-100 rounded-2xl shadow-lg border border-gray-200 overflow-hidden font-sans animate-pulse">
      {/* Header Section */}
      <div className="bg-base-300 max-h-15 p-6 border-b border-slate-200 flex items-center gap-4">
        {/* Avatar Skeleton */}
        <div className="w-12 h-12 skeleton  bg-slate-200 rounded-full shrink-0" />
        {/* Name Skeleton */}
        <div className="w-32 h-4 skeleton bg-slate-200 rounded" />
      </div>

      {/* Card Body */}
      <div className="p-6 card-body card-border grid grid-cols-1 md:grid-cols-2 gap-2">
        
        {/* Left Column: Metadata */}
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="w-20 h-3 skeleton bg-slate-200 rounded" />
              <div className="w-36 h-4 skeleton bg-slate-200 rounded" />
            </div>
          ))}
          {/* Image Viewer Skeleton */}
          <div className="flex flex-col gap-2">
            <div className="w-12 h-3 bg-slate-200 rounded" />
            <div className="w-24 h-8 bg-slate-200 rounded-md" />
          </div>
        </div>

        {/* Right Column: Status & History */}
        <div className="space-y-6">
          {/* Status Badge Skeleton */}
          <div>
            <div className="w-24 h-7 skeleton  bg-slate-200 rounded-md" />
          </div>
          
          {/* Status History Box Skeleton */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-slate-200 skeleton rounded-full" />
              <div className="w-24 h-3 bg-slate-200 skeleton rounded" />
            </div>
            {/* Timeline Skeleton Lines */}
            <div className="space-y-2 pl-6">
              <div className="w-full h-3 bg-slate-200 skeleton rounded" />
              <div className="w-5/6 h-3 bg-slate-200 skeleton rounded" />
              <div className="w-4/5 h-3 bg-slate-200 skeleton rounded" />
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="px-6 pb-6">
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-2">
          <div className="w-full h-3 skeleton bg-slate-200 rounded" />
          <div className="w-11/12 h-3 skeleton bg-slate-200 rounded" />
          <div className="w-3/4 h-3 skeleton bg-slate-200 rounded" />
        </div>
      </div>

      {/* Footer Action Buttons */}
      <div className="p-6 w-full card-actions bg-base-200 flex flex-wrap justify-end gap-3">
        <div className="w-20 h-9 skeleton bg-slate-200 rounded-md" />
        <div className="w-24 h-9 skeleton bg-slate-200 rounded-md" />
      </div>
    </div>))}
    </>
  )
}

export default ModernConcernCardSkeleton