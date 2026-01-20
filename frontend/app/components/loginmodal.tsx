"use client"
import React from 'react'
import { Login } from '../actions'
export default function LoginModal() {
    return (
        <>
            < button type='button' className="btn btn-primary rounded-full w-30" onClick={() => {
                const modal = document.getElementById('login_modal') as HTMLDialogElement | null
                if (modal) {
                    modal.showModal()
                }
            }}> Login </button >
            <dialog id="login_modal" className="modal">
                <div className="modal-box bg-black/45 backdrop-blur-xs max-w-sm flex flex-col items-center border ">
                    <form action={Login} className='w-full px-2'>
                        <button type='button' onClick={() => {
                            const modal = document.getElementById('login_modal') as HTMLDialogElement | null
                            if (modal) {
                                modal.close()
                            }
                        }} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                        <fieldset className='fieldset w-full flex flex-col gap-1.5'>
                            <legend className='fieldset-legend text-2xl '>
                                Signup Form
                            </legend>
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
                        <button className='w-full btn btn-primary rounded-full mt-2'>LOGIN</button>
                    </form>
                </div>
            </dialog>
        </>
    )
}