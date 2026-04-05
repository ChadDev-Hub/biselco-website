"use client"

type Props = {
    row : number;
    col: number;
}

const TableDataSkeleton = ({row, col}: Props) => {
    const rangeRow = Array.from({ length: row}, (_, index) => index );
    const rangeColumn = Array.from({ length: col }, (_, index) => index);
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