"use client"
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { loginfortoken } from '../services/clientApi'

interface Props {
    baseurl?: string;
}

export default function LoginModal({ baseurl }: Props) {
    const router = useRouter()
    const [loginMessage, setLoginMessage] = useState({
        message: "",
        alert_style: "",
        show: false,
        loginsucessfull: false
    })
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formdata = new FormData(e.currentTarget)
        const res = loginfortoken(formdata, baseurl);
        if ((await res).error) {
            setLoginMessage({
                message: "Invalid User or Password",
                alert_style: "alert-warning",
                show: true,
                loginsucessfull: false
            })
            return
        }
        setLoginMessage({
            message: "Login Sucessfully",
            alert_style: "alert-success",
            show: true,
            loginsucessfull: true
        })
        router.push("/")
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoginMessage(prev => ({
                ...prev,
                message: "",
                alert_style: "",
                show: false,
            }))
            if (loginMessage.loginsucessfull) {
                const modal = document.getElementById("login_modal") as HTMLDialogElement | null
                if (modal) {
                    modal.close()
                }
            }
        }, 3000);
        return () => clearTimeout(timer)
    }, [loginMessage.show, loginMessage.loginsucessfull])

    const handleClose = () => {
        const modal = document.getElementById('login_modal') as HTMLDialogElement | null
        if (modal) {
            modal.close()
        }
        const form = document.getElementById("login-form") as HTMLFormElement | null
        form?.reset()
    }
    return (
        <>
            < button type='button' className="btn btn-primary rounded-full w-30" onClick={() => {
                const modal = document.getElementById('login_modal') as HTMLDialogElement | null
                if (modal) {
                    modal.showModal()
                }
            }}> Login </button >
            <dialog id="login_modal" className="modal backdrop-blur-sm">
                <div className="modal-box bg-black/45 backdrop-blur-xs max-w-sm flex flex-col items-center border ">
                    <form id='login-form' onSubmit={handleSubmit} className='w-full px-2'>
                        <button type='button' onClick={handleClose} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                        <fieldset className='fieldset w-full flex flex-col gap-2'>
                            <legend className='fieldset-legend text-2xl '>
                                Signup Form
                            </legend>
                            {/* LOGIN MESSAGE */}
                            {loginMessage.show &&
                                <div role="alert" className={`alert ${loginMessage.alert_style} rounded-full`}>
                                    {loginMessage.loginsucessfull ?
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg> :
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    }
                                    <span>{loginMessage.message}</span>
                                </div>
                            }
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