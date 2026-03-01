'use client'
import { useState } from 'react'
import React from 'react'

type Props= {
    text: string;
}

const ComplaintsCardBody = ({text}:Props) => {
  const [showfulltext, setShowfulltext] = useState(false)
  const handleShowFullText = () => {
    setShowfulltext(!showfulltext)
  }
  return (
    <div className='card-body'>
        <p onClick={handleShowFullText} className={`text-md ${showfulltext? "line-clamp-none" :"line-clamp-4"}`}
        >{text}</p>
    </div>
  )
}

export default ComplaintsCardBody;