"use client"
import React from 'react'



const NewFeedLoading = () => {
    const numberOfCards = Array.from({ length: 3 });
    return (
                <div className="flex flex-col gap-4 w-full justify-center">
                    <div className='skeleton animate-pulse h-10 w-1/2'></div>
                    {numberOfCards.map((_, index) =>
                        <div key={index} className='flex flex-col gap-4'>
                            <div className="flex items-center justify-start gap-4">
                                <div className="skeleton animate-pulse h-16 w-16 shrink-0 rounded-full"></div>
                                <div className="flex flex-col gap-4">
                                    <div className="skeleton animate-pulse h-4 w-20"></div>
                                    <div className="skeleton animate-pulse h-4 w-28"></div>
                                </div>
                            </div>
                            <div className="skeleton animate-pulse mt-4 glass h-80 w-full"></div>
                        </div>)}
                </div>
    )
}

export default NewFeedLoading