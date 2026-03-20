"use client"



const TableDataSkeleton = () => {
    const rangeRow = Array.from({ length: 9 }, (_, index) => index );
    const rangeColumn = Array.from({ length: 12 }, (_, index) => index);
  return (
    <tbody>
        {rangeRow.map((row) => (
            <tr key={row} className="skeleton glass h-5 w-full">
                {rangeColumn.map((column) => (
                    <td key={column} className="skeleton rounded-none h-8 sm:h-9 md:h-10 lg:h-12 w-full glass">
                    </td>
                ))}
            </tr>
        ))}
    </tbody>
  )
}

export default TableDataSkeleton;