"use client"

import {useRef} from 'react'
import McoGoogleLogin from './mcoGoogleLogin';
import FacebookLogin from './facebook.login';

const LoginModal = () => {
    const modalRef = useRef<HTMLDialogElement>(null)
    const handleOpen = () => modalRef.current?.showModal();
    const handleClose = () => modalRef.current?.close();
  return (
    <>
        <button onClick={handleOpen} className="btn btn-primary btn-mdrounded-box">
            Get Started
        </button>
        <dialog className="modal" ref={modalRef}>
            
            <div className="modal-box relative max-w-sm"> 
                <button onClick={handleClose} className="font-bold absolute top-1 right-2 btn btn-sm btn-ghost btn-circle">X</button>
                <h3>Login With </h3>
                <div className="flex flex-col gap-2 items-center">
                    <McoGoogleLogin/>
                    <FacebookLogin/>
                </div>
            </div>

        </dialog>
    </>
  )
}

export default LoginModal