'use client'

import React from 'react'


const DeletePost = () => {
    return (
        <button aria-label='Delete Post' type='button' className='btn btn-circle btn-ghost'>
            <svg fill="currentColor" width={20} height={20} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" id="delete-alt-2" className="icon glyph">
                <g strokeWidth={0}></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round">
                </g>
                <g id="SVGRepo_iconCarrier">
                    <path d="M17,4V5H15V4H9V5H7V4A2,2,0,0,1,9,2h6A2,2,0,0,1,17,4Z">
                    </path>
                    <path d="M20,6H4A1,1,0,0,0,4,8H5.07l.87,12.14a2,2,0,0,0,2,1.86h8.14a2,2,0,0,0,2-1.86L18.93,8H20a1,1,0,0,0,0-2ZM13,17a1,1,0,0,1-2,0V11a1,1,0,0,1,2,0Z">
                    </path>
                </g>
            </svg>
        </button>
    )
}

export default DeletePost