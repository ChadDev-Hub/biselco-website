
import React from 'react'

type Props = {
  children: React.ReactNode;
}

const Accordion = ({ children }: Props) => {
  return (
   
      <div className="collapse collapse-arrow">
        <input title='Complaints Status' type="checkbox" />
        <div className="collapse-title font-semibold w-full min-w-80">See Complaints Status...</div>
        <div className="collapse-content text-sm">
          {children}
        </div>
      </div>


  )
}

export default Accordion