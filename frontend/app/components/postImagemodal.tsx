<<<<<<< HEAD

import React from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'


const PostImageModal = () => {
=======
"use client"
import React, { useState } from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import Image from 'next/image'
import { PostNews } from '../services/serverapi'

const PostImageModal = () => {
    const [uploadedImage, setUploadedImage] = useState<File[]>([])

    const handleUploadedImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.currentTarget.files
        if (!files) {
            return
        }
        setUploadedImage((prev) =>
            [...prev, ...Array.from(files)])

    }

    const handleSubmit = async(event:React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const result = await PostNews(formData)
        console.log(result)
    }
>>>>>>> c18c9ea4afe98a60fc56bb6b6a63110dd0735ee5
    // OPEN MODAL
    const handleOpenModal = () => {
        const modal = document.getElementById("postphoto-modal") as HTMLDialogElement
        if (modal) {
            modal.showModal()
        }
    }
    // CLOSE MODAL
    const handleCloseModal = () => {
        const modal = document.getElementById("postphoto-modal") as HTMLDialogElement
        if (modal) {
            modal.close()
        }
    }
<<<<<<< HEAD
=======

    // REMOVE IMAGE
    const handleRemoveImage = (imageIndex: number) => {
        setUploadedImage((prev) =>
            prev.filter((name, index) => index !== imageIndex)
        )
    }
>>>>>>> c18c9ea4afe98a60fc56bb6b6a63110dd0735ee5
    return (
        <>
            <button aria-label='photos' onClick={handleOpenModal} type='button' className='btn btn-circle btn-ghost tooltip tooltip-bottom sm:tooltip sm:tooltip-right' data-tip="Post Photos">
                <DotLottieReact
                    src="https://lottie.host/1064b7b9-4381-4331-b3c3-24b57d656bdf/Iirp8XKZBu.lottie"
                    loop
                    autoplay
                />
            </button>
            <dialog id='postphoto-modal' className='modal'>
<<<<<<< HEAD
                <form action="" className='modal-box bg-base-200 min-w-fit'>
                    <fieldset className='fieldset flex flex-col w-full'>
                        <div className='flex justify-between'>
                            <legend className='text-lg font-bold text-shadow-2xs text-blue-700'>
                                New News
                            </legend>
                            <button className='btn btn-circle shadow-lg' onClick={handleCloseModal}>x</button>
                        </div>

                        <label className='label text-orange-400'>Title</label>
                        <input type="text" className='input w-full' placeholder='Title' />
                        <div className='grid grid-cols-6 gap-2'>
                            <div className='col-span-4'>
                                <label className=' label text-orange-400'>About</label>
                            <textarea className="textarea h-24" placeholder="About"></textarea>
                            </div>
                            
                            <div className='col-span-2 flex flex-col  items-center justify-center'>
                                <label className="label text-orange-400"> Upload Photos</label>
                                <input type="file" accept='image/*' />
                            </div>
                        </div>

                    </fieldset>
                </form>

=======
                <fieldset  className='form fieldset flex flex-col modal-box bg-base-200 min-w-fit max-w-100 p-4'>
                    <legend className='fieldset-legend w-full flex justify-between text-lg font-bold text-shadow-2xs text-blue-700'>
                        <p>
                            New News
                        </p>
                        <button type='button' className='btn btn-circle shadow-lg' onClick={handleCloseModal}>x</button>
                    </legend>
                    <form onSubmit={handleSubmit}>
                        <label className='label text-orange-400'>Title</label>
                    <input name='title' type="text" className='input w-full' placeholder='Title' />
                    <label className=' label text-orange-400'>About</label>
                    <div className='grid grid-cols-6 gap-2'>
                        <div className='col-span-4 w-full'>

                            <textarea name='description' className="textarea h-24" placeholder="About"></textarea>
                        </div>

                        <div className='col-span-2 flex flex-col items-center justify-center'>
                            <label className="label text-orange-400"> Upload Photos</label>
                            <label className='btn btn-circle'>
                                <svg xmlns="http://www.w3.org/2000/svg"
                                    width={60}
                                    height={60}
                                    viewBox="0 0 1024 1024"
                                    className="icon"
                                    version="1.1">
                                    <path
                                        d="M220.5 245.4c-32.8 32.8-55.1 73.2-65.2 117.3h16.5c18.8-75.3 75.1-135.9 148-160.7v-16.9c-37.1 11.6-71 32-99.3 60.3z"
                                        fill="#E73B37" strokeWidth={4} />
                                    <path d="M959.9 540.8c0 113.6-92.1 205.8-205.7 205.9H590.9v-44h163.3c43.2 0 83.8-16.9 114.3-47.4 30.6-30.6 47.4-71.2 47.4-114.5 0-43.2-16.8-83.9-47.4-114.4S797.2 379 754 379c-11.5 0-22.8 1.2-33.8 3.5-15 3.2-29.4 8.4-42.8 15.7-1-15.4-3.3-30.7-6.8-45.6v-0.1c-3.6-15.6-8.6-30.8-14.9-45.7-14.4-33.9-34.9-64.4-61.1-90.6-26.2-26.2-56.6-46.7-90.6-61.1-35.1-14.8-72.4-22.4-110.9-22.4s-75.8 7.5-110.9 22.4c-33.9 14.3-64.4 34.9-90.6 61.1-26.2 26.2-46.7 56.7-61.1 90.6-14.9 35.1-22.4 72.4-22.4 110.9s7.5 75.8 22.4 110.9c14.3 33.9 34.9 64.4 61.1 90.6 26.2 26.2 56.7 46.7 90.6 61.1 35.1 14.8 72.4 22.4 110.9 22.4h39.7v44h-41C210.7 746 64.1 599 64.1 417.7c0-181.7 147.3-329 329-329 154.6 0 284.3 106.6 319.5 250.3v0.1c13.4-2.7 27.2-4.2 41.4-4.2 113.7 0.1 205.9 92.2 205.9 205.9z" fill='currentColor' />
                                    <path d="M692.9 636.1h-22.6L519.8 485.6v449.6h-16V485.8L353.4 636.1h-22.6l181-181z" fill="orange" />
                                </svg>
                                <input type="file" accept='image/*' onChange={handleUploadedImage} className='hidden' multiple />
                            </label>
                        </div>
                    </div>
                    <div className='grid grid-cols-3 gap-3 overflow-y-auto max-h-50 max-w-100 py-4 inset-shadow-2xs'>
                        {uploadedImage.map((im, index) => (
                            <div key={index}>
                                <div className='w-full flex justify-end'>
                                    <button key={index} type='button' onClick={() => handleRemoveImage(index)} className='btn btn-ghost btn-sm'>X</button>
                                </div>
                                <Image
                                    src={URL.createObjectURL(im)}
                                    alt='Uploaded Images'
                                    width={100}
                                    height={100}
                                />
                            </div>

                        ))}
                    </div>
                    <button type='submit' className='btn btn-success w-full rounded-full'>
                        Upload
                    </button>
                    </form>     
                </fieldset>
>>>>>>> c18c9ea4afe98a60fc56bb6b6a63110dd0735ee5
            </dialog>
        </>

    )
}

export default PostImageModal;