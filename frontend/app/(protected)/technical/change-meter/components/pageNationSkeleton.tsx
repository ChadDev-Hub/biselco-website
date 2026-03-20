"use client"

import React from 'react'




const PageNationLoading = () => {
    return (
        <tbody>
            <tr>
                <td colSpan={12}>
                    <div className='join '>
                        <div className='skeleton glass h-8 w-10 rounded-l-box rounded-r-none'></div>
                        <hr className='border border-gray-200'></hr>
                        <div className='skeleton glass h-8 w-10 rounded-none'></div>
                        <hr className='border border-gray-200'></hr>
                        <div className='skeleton glass h-8 w-10 rounded-r-box rounded-l-none'></div>
                    </div>
                </td>
            </tr>
        </tbody>
    )
}

export default PageNationLoading