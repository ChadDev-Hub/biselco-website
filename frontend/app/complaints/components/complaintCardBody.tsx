'use client'
import { useState } from 'react'

type Props = {
  text: string;
}

const ComplaintsCardBody = ({ text }: Props) => {
  const [showfulltext, setShowfulltext] = useState(false)
  const handleShowFullText = () => {
    setShowfulltext(!showfulltext)
  }
  return (
    <div className='card-body'>
      <div onClick={handleShowFullText} className={`text-md ${showfulltext ? "line-clamp-none" : "line-clamp-4"}`}
      >
        {
          text.split("\n").map((item, index) => (
            <div key={index} className={`${item.includes("Details") ? "mt-2" : ""}`}>
              {item.split(":")[0] && <span className='font-bold'>{item.split(":")[0]}</span>}
              {item.split(":")[1] && <span>{item.split(":")[1]}</span>}
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default ComplaintsCardBody;