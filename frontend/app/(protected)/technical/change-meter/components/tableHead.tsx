"use client"



const TableHead = () => {
  return (
    <thead>
    <tr className="font-bold text-black text-center">
        <th className='p-2'>✅</th>
        <th className='p-2'>ID</th>
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
        <td className='p-2'>ACCOMPLISHED BY</td>
    </tr>
   </thead>
  )
}

export default TableHead;