"use client"


type Props = {
  selectable: boolean
  columns: string[]
}


const TableHead = ({selectable, columns}:Props) => {
  return (
    <thead>
    <tr className="font-bold text-black text-center">
        {selectable && <th className='p-2'>✅</th> }
        {columns.map((column:string, index) => (
            !selectable && index === 0 ? <th key={index} className='p-2'>{column}</th> 
            : <td key={index} className='p-2'>{column}</td>
          ))}
        {/* <td className='p-2'>ID</td>
        <td className='p-2'>DATE ACCOMPLISHED</td>
        <td className='p-2'>ACCOUNT NUMBER</td>
        <td className='p-2'>CONSUMER NAME</td>
        <td className='p-2'>LOCATION</td>
        <td className='p-2'>PULLOUT METER</td>
        <td className='p-2'>PULLOUT METER NUMBER</td>
        <td className='p-2'>NEW METER SERIAL NUMBER</td>
        <td className='p-2'>NEW METER BRAND</td>
        <td className='p-2'>INITIAL READING</td>
        <td className='p-2'>REMARKS</td>
        <td className='p-2'>ACCOMPLISHED BY</td> */}
    </tr>
   </thead>
  )
}

export default TableHead;