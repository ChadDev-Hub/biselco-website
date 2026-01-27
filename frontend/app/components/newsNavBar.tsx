"use client"
import React from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import PostImageModal from './postImagemodal'

const NewsNavBar = () => {
    return (
        <div className="navbar flex gap-2 bg-base-100 shadow-lg rounded-full px-4  max-w-75 lg:max-w-150 mx-auto">
            <input type="text" placeholder="Search" className="input w-full rounded-full input-bordered  " />
            <PostImageModal/>
            <button aria-label='photos' type='button' className='btn btn-circle btn-ghost sm:tooltip sm:tooltip-right tooltip tooltip-bottom' data-tip = "Post Video">
                <DotLottieReact
                    src="https://lottie.host/17f1c733-1fd5-4b56-ba03-2ec3eee01355/N4y3ORKdib.lottie"
                    loop
                    autoplay
                    />
            </button>
        </div>
    )
}

export default NewsNavBar