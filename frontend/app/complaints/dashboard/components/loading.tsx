import React from 'react'

const ComplaintsLoading = () => {
    const numberOfCard = Array.from({ length: 3 })
    return (
        <div className='w-full flex flex-col gap-5'>
            {
                numberOfCard.map((m, index) =>
                    <div key={index} className='skeleton bg-base-100/45 p-4 h-50 w-full animate-pulse'>
                        <div className='skeleton w-40 h-10 bg-base-200'>
                        </div>
                        <div className='skeleton h-5 w-full gap-2 items-center mt-10'></div>
                        <div className='grid grid-cols-12 mt-4'>
                            <div className='grid col-span-11  grid-rows-3 w-full gap-2'>
                                <div className='skeleton h-5 w-full'></div>
                                <div className='skeleton h-5 w-full'></div>
                            </div>
                            <div className='skeleton flex justify-center rounded-full h-10 w-10'></div>
                        </div>
                    </div>
                )
            }

        </div>
    )
}

export default ComplaintsLoading;