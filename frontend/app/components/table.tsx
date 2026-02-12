import React from 'react'

type Props = {
    children: React.ReactNode
}

const DashBoardTable = ({children}: Props) => {
  return (
    <div className='overflow-x-auto h-96 w-full rounded-box '>
        <table className='table  table-md table-zebra table-pin-rows table-pin-cols'>
          {children}
        </table>
    </div>
  )
}

export default DashBoardTable;