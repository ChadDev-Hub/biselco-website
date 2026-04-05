"use client"
import React, { useState } from 'react'
import AdminGoogleLogin from './adminGoogleLogin'
import { GoogleLoginRoute } from '@/app/actions/auth'


const LoginForm = () => {
    const [adminLoginSecretKey, setAdminLoginSecretKey] = useState<string>("")
    const [errors, setErrors] = useState<{ [key: string]: string }>({})
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAdminLoginSecretKey(e.target.value)
    }
    const validate = (): boolean => {
        const newErrors: { [key: string]: string } = {}
        if (adminLoginSecretKey === "") newErrors.adminLoginSecretKey = "Admin Login Secret Key is required."
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0;
    }
    const handleLogin = async () => {
        if (!validate()) return
        const res = await GoogleLoginRoute(adminLoginSecretKey)
        if (res?.error) {
            const newErrors: { [key: string]: string } = {}
            newErrors.adminLoginSecretKey = res.error
            setErrors(newErrors)
            return
        }
    }
        return (
            <div className='w-full flex justify-center'>
                <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-sm border p-4">
                    <legend className="fieldset-legend text-lg font-bold text-yellow-500">Login</legend>
                    <label className="label">Email</label>
                    <input type="email" className="input w-full rounded-full" placeholder="Email" />
                    <label className="label">Password</label>
                    <input type="password" className="input w-full rounded-full" placeholder="Password" />
                    <button type='button' className="btn btn-neutral mt-4 rounded-full">Login</button>
                    <h2 className='text-center'>
                        OR CONTINUE WITH
                    </h2>
                    <label className='label'>
                        Admin Login Secret Key
                    </label>
                    <input required type="text" value={adminLoginSecretKey} onChange={handleChange} className='input w-full rounded-full mb-2' placeholder='Input Admin Login Secret Key' />
                    {errors.adminLoginSecretKey && <span className='text-red-500 text-center'>{errors.adminLoginSecretKey}</span>}
                    <div className='flex justify-center items-center'>
                        <div className='flex items-center rounded-full border overflow-hidden'>
                            <AdminGoogleLogin login={handleLogin} />
                        </div>
                    </div>
                </fieldset>
            </div>
        )
    }

    export default LoginForm