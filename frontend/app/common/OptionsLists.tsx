
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
            </ul>
        </div>
    )
}

export default Options