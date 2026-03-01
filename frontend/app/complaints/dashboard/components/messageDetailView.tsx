
import React, { useRef } from 'react'

type Props = {
    complaintDescription: string;
}

const MessageDetailView = ({ complaintDescription }: Props) => {
    const messageModalRef = useRef<HTMLDialogElement>(null);
    const handleOpen = () => {
        messageModalRef.current?.showModal()
    }
    const handleClose = () => {
        messageModalRef.current?.close()
    }
    return (
        <>
            <button aria-label='modal-button' data-tip="View Complaint Message" onClick={handleOpen} type='button' className='btn btn-circle btn-ghost tooltip tooltip-right'>
                <svg
                    width={30}
                    height={30}
                    viewBox="0 0 1024 1024"
                    className="icon drop-shadow-md drop-shadow-amber-900"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#000000">
                    <g id="SVGRepo_bgCarrier"
                        strokeWidth="0">
                    </g>
                    <g id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round">
                    </g>
                    <g id="SVGRepo_iconCarrier">
                        <path d="M896 192H128c-35.3 0-64 28.7-64 64v512c0 35.3 28.7 64 64 64h576.6l191.6 127.7L896 832c35.3 0 64-28.7 64-64V256c0-35.3-28.7-64-64-64z" fill="#3D5AFE">
                        </path>
                        <path d="M640 512c0-125.4-51.5-238.7-134.5-320H128c-35.3 0-64 28.7-64 64v512c0 35.3 28.7 64 64 64h377.5c83-81.3 134.5-194.6 134.5-320z" fill="#536DFE">
                        </path>
                        <path className='animate-ping' d="M256 512m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" fill="#FFFF8D">
                        </path>
                        <path className='animate-ping' d="M512 512m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" fill="#FFFF00">
                        </path>
                        <path className='animate-ping' d="M768 512m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" fill="#FFEA00">
                        </path>
                    </g>
                </svg>

            </button>
            <dialog ref={messageModalRef} className="modal">
                <div className='modal-box flex flex-col gap-3'>
                    <h3 className='text-lg font-bold'>
                        Complaints Details
                    </h3>
                    <p className='text-md italic'>
                        {complaintDescription}
                    </p>
                    <div className='modal-action'>
                        <button onClick={handleClose} type='button' className='btn btn-neutral'>Close</button>
                    </div>
                </div>
            </dialog>
        </>
    )
}

export default MessageDetailView;