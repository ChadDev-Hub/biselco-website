

import React from 'react'


type Props = {
    children: React.ReactNode
    width?: number | string
    className: string
    onClick?: () => void
}

const CardComponent = ({ className, children, onClick}: Props) => {
    
  return (
    <div onClick={onClick} className={`card ${className} shadow-sm`}>
        {children}
    </div>
  )
}

export default CardComponent;