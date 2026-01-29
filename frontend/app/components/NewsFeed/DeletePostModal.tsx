"use client"

import React from 'react'

type Props = {}

const DeletePostModal = (props: Props) => {
    const handleopenModal = () => {
        const modal = document.getElementById("delete-post") as HTMLDialogElement
        if (modal){
            modal.showModal()
    }}

    const handleCloseModal = () => {
        const modal = document.getElementById("delete-post") as HTMLDialogElement
        if (modal){
            modal.close()
        }
    }
  return (
    <>
    <button type='button' onClick={handleopenModal} className='btn btn-circle'>x</button>
    <dialog id="delete-post" className='modal'>
        <div className='modal-box'>
            <div className='modal-start'>
                <p>Delete This Post?</p>
            </div>
            <div className='modal-bottom flex justify-end gap-4'>
                <button type='button' className='btn btn-warning rounded-full'>Delete</button>
                <button onClick={handleCloseModal}  type='button' className='btn btn-primary rounded-full'>Cancel</button>
            </div>
        </div>
    </dialog>
    </>
    
  )
}

export default DeletePostModal