
import React from 'react'

type Props = {
    children: React.ReactNode
}

const ComplaintCardHeader = ({children}: Props) => {
  return (
    <header className='card-title px-4 py-2 flex justify-between'>
        {children}
    </header>
  )
}

export default ComplaintCardHeader