"use client"
import React, { useState } from 'react'
type Props = {
    title:string;
    description:string;
}

const NewsText = ({title,description}: Props) => {
    const [showFullText, setshowFullText] = useState(false)
    const handleShowFullText = () => {
        setshowFullText(!showFullText)
    }
    return (
        <div className="px-6 py-2">
            <h2 className="text-2xl font-extrabold text-blue-300 text-shadow-2xs mb-2 leading-snug">
                {title}
            </h2>
            <p  onClick={handleShowFullText} className={`${showFullText?"" :"cursor-pointer"}  text-sm ${showFullText? "line-clamp-none" :"line-clamp-4"}`}>
                {description}
            </p>
        </div>
  )
}

export default NewsText