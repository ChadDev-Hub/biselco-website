"use client"
import React from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import PostImageModal from './postImagemodal'

const NewsNavBar = () => {
    return (
        <div className="navbar flex gap-2 shadow-lg rounded-full w-full px-10">
            <input type="text" placeholder="Search" className="input w-full rounded-full input-bordered bg-base-100/45" />
            <PostImageModal/>
            <button aria-label='photos' type='button' className='btn btn-circle btn-ghost tooltip tooltip-bottom sm:tooltip-bottom' data-tip = "Post Video">
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