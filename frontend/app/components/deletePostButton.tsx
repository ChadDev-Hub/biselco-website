'use client'

import React, { useEffect, useRef, useState } from 'react'
import { DeleteNews } from '../actions/news'
import { useAlert } from '../common/alert'
type Props = {
    postId: number;
}
const DeletePost = ({ postId }: Props) => {
    const modalRef = useRef<HTMLDialogElement | null>(null);
    const handleOpen = () => modalRef.current?.showModal()
    const handleClose = () => modalRef.current?.close()
    const {showAlert} = useAlert();
    const handleDelete = async() => {
        const res = await DeleteNews(postId)
        if (res?.status === 200) {
            handleClose();
            showAlert("success", "Post Deleted Successfully")
        }
    }
    return (
        <>  
            <button aria-label='Delete Post' type='button' className='btn btn-circle btn-ghost' onClick={handleOpen}>
                <svg fill="currentColor" width={20} height={20} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"  className="icon glyph">
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
            <dialog className='modal flex justify-center items-center backdrop-blur-md' ref={modalRef}>
                <div className='modal-box glass'>
                    <button type='button' aria-label='Close Modal' onClick={handleClose} className='btn btn-circle absolute top-2 right-2'>X</button>
                    <h3 className="font-bold text-lg text-warning">Confirmation to Delete Post</h3>
                    <div className='modal-action'>
                        <button onClick={handleDelete} type='button' className='btn btn-warning flex flex-row '>
                            <h3>Confirm</h3>
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
                    </div>
                </div>
            </dialog>
        </>
    )
}

export default DeletePost