"use client"

const ChangeMeterCardSkeleton = () => {
    const numberofCards = Array.from({ length: 8 }, (_, index) => index);
    return (
        <div className="grid grid-cols-1 px-2  sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2  place-items-center">

            {numberofCards.map((card) => (
                <div key={card} className="skeleton relative glass p-2 h-fit w-fit">
                <div className="skeleton w-4 h-4 absolute top-1 right-2"></div>
                <div className="flex gap-4">
                    <div className="skeleton glass h-20 w-20"></div>
                    <div className="flex flex-col gap-2 max-w-lg w-full">
                        <div className="skeleton glass h-3 w-32"></div>
                        <div className="skeleton glass h-3 w-29"></div>
                        <div className="skeleton glass h-3 w-24"></div>
                    </div>
                </div>
                <div className="skeleton flex flex-col gap-2 mt-4 glass p-2 rounded-box  w-full ">
                    <div className="skeleton mt-2  rounded-box glass w-20 h-5"></div>
                    <div className="grid grid-cols-[1fr_auto_1fr] gap-2">
                        <div className="flex flex-col gap-2">
                            <div className="skeleton glass h-3 w-25">
                            </div>
                            <div className="skeleton glass h-3 w-20">
                            </div>
                            <div className="skeleton glass h-3 w-25">
                            </div>
                            <div className="skeleton glass h-3 w-20">
                            </div>
                        </div>

                        <div className="h-full flex items-center">
                            <div className="skeleton glass h-10 w-10"></div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="skeleton glass h-3 w-15">
                            </div>
                            <div className="skeleton glass h-3 w-35">
                            </div>
                            <div className="skeleton glass h-3 w-25">
                            </div>
                            <div className="skeleton glass h-3 w-22">
                            </div>
                        </div>
                    </div>
                </div>
            </div>))}

        </div>

    )
}

export default ChangeMeterCardSkeleton