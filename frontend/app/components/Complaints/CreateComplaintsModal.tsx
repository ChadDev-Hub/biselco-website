
import React from 'react'
import ComplaintsForm from './ComplaintsForm'


const CreateComplaints = () => {
    const handleClick = () => {
        const modal = document.getElementById('complaints-modal') as HTMLDialogElement;
        if (modal) {
            modal.showModal()
        }
    };
    const handleClose = () => {
        const modal = document.getElementById('complaints-modal') as HTMLDialogElement;
        const form = document.getElementById('complaints-form') as HTMLFormElement
        if (modal) {
            modal.close()
        }
        if (form) {
            form.reset()
        }
    };
    return (
        <>
            <button aria-label='modal' onClick={handleClick} type='button' className='btn btn-lg btn-circle'>
                <svg width={25}
                    height={25} viewBox="0 0 24 24"
                    fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="SVGRepo_bgCarrier" strokeWidth="0">
                    </g>
                    <g  strokeLinecap="round" strokeLinejoin="round">
                    </g>
                    <g >
                        <path d="M13.5 3H12H8C6.34315 3 5 4.34315 5 6V18C5 19.6569 6.34315 21 8 21H11M13.5 3L19 8.625M13.5 3V7.625C13.5 8.17728 13.9477 8.625 14.5 8.625H19M19 8.625V11.8125" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                        </path>
                        <path d="M17 15V18M17 21V18M17 18H14M17 18H20" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                        </path>
                    </g>
                </svg>
            </button>
            <dialog id="complaints-modal" className="modal backdrop-blur-2xl transition-all">
                <fieldset className='fieldset modal-box w-full z-40'>
                    <legend className='fieldset-legend text-2xl font-bold w-full'>
                        <p>
                            Create Complaints
                        </p>
                        <button type='button' className='btn btn-circle shadow-lg' onClick={handleClose}>x</button>
                    </legend>
                    <ComplaintsForm />
                </fieldset>
            </dialog>
        </>
    )
}
export default CreateComplaints