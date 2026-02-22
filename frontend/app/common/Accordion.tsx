
import React from 'react'

type Props = {
  children: React.ReactNode;
  title: string;
}

const Accordion = ({ children, title }: Props) => {
  return (
   
      <div className="collapse collapse-arrow">
        <input title='Complaints Status' type="checkbox" />
        <div className="collapse-title font-semibold w-full min-w-80 duration-700">{title}</div>
        <div className="collapse-content text-sm transition-all duration-700 ease-in-out">
          {children}
        </div>
      </div>


  )
}

export default Accordion