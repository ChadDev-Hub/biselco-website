

import React from 'react'

type Props = {
    title: string;
}

const Headers = ({title}: Props) => {
  return (
    <header className="max-h-20 py-0 mb-2 rounded-b-4xl flex justify-center items-center bg-blue-700 shadow-lg">
        <h1 className='text-2xl text-white font-bold'>{title}</h1>
    </header>
  )
}

export default Headers