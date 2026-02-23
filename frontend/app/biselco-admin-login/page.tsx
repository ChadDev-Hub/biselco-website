"use server"


import React from 'react'
import AdminLoginHeader from './components/header'
import LoginForm from './components/loginform'
const AdminLoginPage = async() => {
  return (
    <div className='
    min-h-screen flex flex-col items-center justify-start
    bg-zinc-50 font-sans
    bg-linear-to-bl from-blue-600 to-yellow-600
    '>
      <main className='
      container
      max-w-190
      px-3
      flex 
      gap-4 
      flex-col 
      lg:items-center 
      mt-20 
      sm:mt-20 
      md:mt-20
      lg:mt-20 
      pb-21'>
        <AdminLoginHeader/>
        <LoginForm/>
      </main>
    </div>
  )
}

export default AdminLoginPage;
