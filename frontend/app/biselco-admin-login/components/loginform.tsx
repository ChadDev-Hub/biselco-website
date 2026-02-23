"use client"
import React, {useState} from 'react'
import AdminGoogleLogin from './adminGoogleLogin'


const LoginForm = () => {
    const [adminLoginSecretKey, setAdminLoginSecretKey] = useState<string>("")
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAdminLoginSecretKey(e.target.value)
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
            <div className='flex justify-center items-center'>
                <div className='flex items-center rounded-full border overflow-hidden'>
                    <AdminGoogleLogin adminLoginSecretKey={adminLoginSecretKey}/>
                </div>
            </div>
        </fieldset>
        </div>
    )
}

export default LoginForm