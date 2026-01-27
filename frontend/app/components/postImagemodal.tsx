
import React from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'


const PostImageModal = () => {
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

            </dialog>
        </>

    )
}

export default PostImageModal;