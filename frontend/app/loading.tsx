"use client"
import { main } from 'framer-motion/client'
import React from 'react'



const NewFeedLoading = () => {
    const numberOfCards = Array.from({ length: 3 });
    return (
        <div className="flex min-h-screen items-start w-full justify-center bg-zinc-50 font-sans  bg-linear-to-bl from-blue-600 to-yellow-600">
            <main className='
        container
      max-w-190
      px-3
      flex 
      gap-4 
      flex-col 
      lg:items-center 
      mt-20 
      sm:mt-20 
      md:mt-20
      lg:mt-20 
      pb-21'>
                <div className="flex flex-col gap-4 w-full justify-center">
                    <div className='skeleton animate-pulse h-10 w-1/2'></div>
                    {numberOfCards.map((_, index) =>
                        <div key={index}>
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
            </main>
        </div>

    )
}

export default NewFeedLoading