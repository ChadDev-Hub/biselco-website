"use client"
import React, { useEffect, useState } from 'react'
import { Signup } from '@/app/actions/auth'
import GoogleLoginButton from './googlelogin'
export default function SignupModal() {
    const [signupMessage, setSignupMessage] = useState({
        message: "",
        alertstyle: "",
        show: false,
        signupsuccessull: false

    })

    const handleSubmit = async (formdata: FormData) => {
        const results = await Signup(formdata)
        if (results?.error) {
            setSignupMessage({
                message: results.error,
                alertstyle: "alert-error",
                show: true,
                signupsuccessull: false
            })
            return
        }


        setSignupMessage({
            message: results.detail,
            alertstyle: "alert-success",
            show: true,
            signupsuccessull: true
        })
    }

    useEffect(() => {
        if (!signupMessage.show) return;
        const timer = setTimeout(() => {
            setSignupMessage(prev => ({
                ...prev,
                message: "",
                alertstyle: "",
                show: false
            }))
            if (signupMessage.signupsuccessull) {
                const modal = document.getElementById("signup_modal") as HTMLDialogElement | null;
                modal?.close();
            }
        }, 3000);

        return () => clearTimeout(timer)
    }, [signupMessage.show, signupMessage.signupsuccessull])


    const handleClose = () => {
        const modal = document.getElementById('signup_modal') as HTMLDialogElement | null
        if (modal) {
            modal.close()
        }
        const form = document.getElementById('signup-form') as HTMLFormElement | null
        if (form){
            form.reset()
        }
    }
    return (
        <>
            < button type='button' className="btn btn-secondary w-30 rounded-full" onClick={() => {
                const modal = document.getElementById('signup_modal') as HTMLDialogElement | null
                if (modal) {
                    modal.showModal()
                }
            }}> Signup</button >
            <dialog id="signup_modal" className="modal backdrop-blur-sm">
                <div className="modal-box bg-black/45 border backdrop-blur-xs max-w-sm flex flex-col items-center ">
                    <form id='signup-form' action={handleSubmit} className='w-full px-2'>
                        <button type='button' onClick={handleClose} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                        <fieldset className='fieldset w-full'>
                            <legend className='fieldset-legend text-2xl '>
                                Signup Form
                            </legend>
                            {/* ERROR ALLER */}
                            {signupMessage.show && <div id='signupalert' role="alert" className={`alert ${signupMessage.alertstyle} rounded-full`}>

                                {signupMessage.signupsuccessull ?
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg> : <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>}
                                <span>{signupMessage.message}</span>
                            </div>}
                            {/* FIRSTNAME */}
                            <input name='firstname' type="text" className='input rounded-full' placeholder='First Name' />

                            {/* LASTNAME */}
                            <input name='lastname' type="text" className='input rounded-full' placeholder='Last Name' />
                            {/* EMAIL */}
                            <label className="input validator rounded-full">
                                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <g
                                        strokeLinejoin="round"
                                        strokeLinecap="round"
                                        strokeWidth="2.5"
                                        fill="none"
                                        stroke="currentColor"
                                    >
                                        <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                                    </g>
                                </svg>
                                <input name='email' type="email" placeholder="mail@site.com" required />
                            </label>
                            <div className="validator-hint hidden">Enter valid email address</div>
                            {/* USERNAME INPUT */}
                            <label className="input validator rounded-full">
                                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <g
                                        strokeLinejoin="round"
                                        strokeLinecap="round"
                                        strokeWidth="2.5"
                                        fill="none"
                                        stroke="currentColor"
                                    >
                                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </g>
                                </svg>
                                <input
                                    name='username'
                                    type="text"
                                    required
                                    placeholder="Username"
                                    pattern="[A-Za-z][A-Za-z0-9\-]*"
                                    minLength={3}
                                    maxLength={30}
                                    title="Only letters, numbers or dash"
                                />
                            </label>
                            <p className="validator-hint hidden">
                                Must be 3 to 30 characters
                                <br />containing only letters, numbers or dash
                            </p>
                            {/* PASSWORD INPUT */}
                            <label className="input validator rounded-full">
                                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <g
                                        strokeLinejoin="round"
                                        strokeLinecap="round"
                                        strokeWidth="2.5"
                                        fill="none"
                                        stroke="currentColor"
                                    >
                                        <path
                                            d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
                                        ></path>
                                        <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                                    </g>
                                </svg>
                                <input
                                    name='password'
                                    type="password"
                                    required
                                    placeholder="Password"
                                    minLength={8}
                                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                                    title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
                                />
                            </label>
                            <p className="validator-hint hidden">
                                Must be more than 8 characters, including
                                <br />At least one number <br />At least one lowercase letter <br />At least one uppercase letter
                            </p>
                        </fieldset>
                        
                        <div className='flex flex-col gap-2.5 items-center'>
                            <button type='submit' className='w-full mt-2 btn btn-primary rounded-full'>SIGNUP</button>
                            <p className='text-2xl'>OR</p>
                            <GoogleLoginButton/>
                        </div>
                    </form>
                </div>
            </dialog>
        </>
    )
}