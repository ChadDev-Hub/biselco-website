
"use client"

import React from 'react'



const Header = () => {
  return (
    <header className="bg-linear-to-r from-blue-700 to-indigo-800 text-white py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <p className="text-blue-200 text-sm font-semibold uppercase tracking-wider mb-2">About Us</p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Busuanga Island Electric Cooperative Inc.
          </h1>
          <p className="text-xl text-blue-100 font-medium max-w-2xl mx-auto">
            Powering progress across the Calamianes Group of Islands since 1979.
          </p>
        </div>
      </header>
  )
}

export default Header