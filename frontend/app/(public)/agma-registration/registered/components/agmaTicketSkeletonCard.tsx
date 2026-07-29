"use client";

const AgmaTicketSkeletonCard = () => {
    const labelStyle = "skeleton h-3 w-15 bg-slate-200";
    const infoStyle = "skeleton h-5 w-32 bg-slate-200"
    const imageStyle = "relative h-20 w-20 skeleton overflow-hidden rounded-xl border-2 border-white bg-slate-200 shadow-md"
    const divholderStyle = "space-y-2"
  return (
    <div className="relative w-full max-w-md mx-auto overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-xl">
      <div className="h-2 bg-yellow-500 w-full"></div>
      {/* Top Section: Header & Profile */}
      <div className="p-6 bg-primary/5">
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-2">
            <p className="skeleton h-4 w-20 bg-slate-200"></p>
            <h1 className="skeleton h-8 w-40 bg-slate-200"></h1>
          </div>
          <div className="text-right h-6 w-20   skeleton bg-slate-200"></div>
        </div>
        {/* IMAGE */}
        <div className="flex items-center gap-4">
          <div className={imageStyle}></div>
          <div className="flex-1 space-y-2">
            <h2 className="skeleton h-4 w-32 bg-slate-200"></h2>
            <p className="skeleton h-4 w-32 bg-slate-200"></p>
            <p className="skeleton h-4 w-32 bg-slate-200"></p>
          </div>
        </div>
      </div>
      <div className="p-6 pt-4">
        <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
          <div className={divholderStyle}>
            <p className={labelStyle}>
              
            </p>
            <p className={infoStyle}>
            </p>
          </div>
          <div className={divholderStyle}>
            <p className={labelStyle}>
             
            </p>
            <p className={infoStyle}>
            </p>
          </div>
          <div className={divholderStyle}>
            <p className={labelStyle}>
              
            </p>
            <p className={infoStyle}>
            </p>
          </div>
          <div className={divholderStyle}>
            <p className={labelStyle}>
            </p>
            <p className={infoStyle}>
              
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
         
          {/* Signature & Action */}
          <div className="mt-6 flex items-end justify-between">
            <div className={imageStyle}>
            </div>
          </div>
        </div>
      </div>
      <div className="h-2 bg-primary w-full"></div>
    </div>
  );
};

export default AgmaTicketSkeletonCard;
