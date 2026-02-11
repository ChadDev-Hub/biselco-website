
"use client"
import React from 'react'
import Delete from './modal/deletemodal'

type Props = {
    deletecomplaint: (onClose: () => void) => React.ReactNode;
}

const Options = ({deletecomplaint}:Props) => {
    return (
        <div className="dropdown dropdown-left">
            <div aria-label='options' tabIndex={0} role="button" className="btn m-1 btn-circle btn-ghost">
                <svg
                    width={25}
                    height={25}
                    viewBox="0 0 16 16"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    className="bi bi-three-dots-vertical">
                    <g id="SVGRepo_bgCarrier"
                        strokeWidth="0">
                    </g>
                    <g id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round">
                    </g>
                    <g>
                        <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z">
                        </path>
                    </g>
                </svg>
            </div>
            <ul tabIndex={-1} className="dropdown-content menu bg-base-100/45 rounded-box z-1 w-fit p-2 shadow-sm">
                <li>
                    <Delete>
                        {(close) => deletecomplaint(close)}
                    </Delete>
                </li>
                <li>
                    <button type='button' data-tip="Edit Complaint" aria-label='edit' className='btn btn-circle btn-ghost btn-md tooltip tooltip-left'>
                        <svg
                            width={20}
                            height={20}
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg" 
                            d="edit"
                            className="icon glyph"
                            fill="currentColor">
                            <g id="SVGRepo_bgCarrier" strokeWidth="0">
                            </g>
                            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round">
                            </g>
                            <g id="SVGRepo_iconCarrier">
                                <path d="M20.71,3.29a2.91,2.91,0,0,0-2.2-.84,3.25,3.25,0,0,0-2.17,1L7.46,12.29s0,0,0,0a.62.62,0,0,0-.11.17,1,1,0,0,0-.1.18l0,0L6,16.72A1,1,0,0,0,7,18a.9.9,0,0,0,.28,0l4-1.17,0,0,.18-.1a.62.62,0,0,0,.17-.11l0,0,8.87-8.88a3.25,3.25,0,0,0,1-2.17A2.91,2.91,0,0,0,20.71,3.29Z">
                                </path>
                                <path d="M21,22H3a1,1,0,0,1,0-2H21a1,1,0,0,1,0,2Z" >
                                </path>
                            </g>
                        </svg>
                    </button>
                </li>
            </ul>
        </div>
    )
}

export default Options