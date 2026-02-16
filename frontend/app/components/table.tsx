import React from 'react'

type Props = {
    children: React.ReactNode
}

const DashBoardTable = ({children}: Props) => {
  return (
    <div className='overflow-x-auto h-full w-full rounded-box shadow drop-shadow-md'>
        <table className='table table-xs sm:table-sm md:table-md lg:table-md table-zebra table-pin-rows table-pin-cols'>
          {children}
        </table>
    </div>
  )
}

export default DashBoardTable;