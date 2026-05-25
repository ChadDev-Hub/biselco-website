

import React from 'react'

type Props = {
    title: string;
    subtitle?: string
}

const Headers = ({title, subtitle}: Props) => {
  return (
    <header className="p-4 w-full place-items-center   mb-2 rounded-b-4xl bg-blue-700 shadow-lg">
      <div className="max-w-3xl text-center  w-full">
        <h1 className='text-2xl  text-white font-bold'>{title}</h1>
        <p className='text-sm text-white'>{subtitle}</p>

      </div>
        
    </header>
  )
}

export default Headers