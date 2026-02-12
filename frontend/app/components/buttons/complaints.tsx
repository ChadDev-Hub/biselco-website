"use client"

import React from 'react'
import { useRouter } from 'next/navigation'


type Props = {
    svgfill: string;
    strokeColor: string;
    orientation: string;
}
const ComplaintsRouteButton = ({ svgfill, strokeColor, orientation }: Props) => {
    const router = useRouter()
    const handleClick = () => {
        router.push("/complaints")
    }
    return (
        <button name='complaints' onClick={handleClick} type='button' aria-label='Complaint Button Route' className={`is-drawer-close:tooltip is-drawer-close:tooltip-right ${orientation} items-center lg:flex-row`} data-tip="Complaints">
            <svg xmlns="http://www.w3.org/2000/svg" stroke={strokeColor} width={24} height={24} viewBox="0 0 24 24">
                <path d="M20.3116 12.6473C19.7074 14.9024 19.4052 16.0299 18.7203 16.7612C18.1795 17.3386 17.4796 17.7427 16.7092 17.9223C16.6129 17.9448 16.5152 17.9621 16.415 17.9744C15.4999 18.0873 14.3834 17.7881 12.3508 17.2435C10.0957 16.6392 8.96815 16.3371 8.23687 15.6522C7.65945 15.1114 7.25537 14.4115 7.07573 13.641C6.84821 12.6652 7.15033 11.5377 7.75458 9.28263L8.27222 7.35077C8.35912 7.02646 8.43977 6.72546 8.51621 6.44561C8.97128 4.77957 9.27709 3.86298 9.86351 3.23687C10.4043 2.65945 11.1042 2.25537 11.8747 2.07573C12.8504 1.84821 13.978 2.15033 16.2331 2.75458C18.4881 3.35883 19.6157 3.66095 20.347 4.34587C20.9244 4.88668 21.3285 5.58657 21.5081 6.35703C21.669 7.04708 21.565 7.81304 21.2766 9"
                    stroke={strokeColor}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    fill={svgfill} />
                <path
                    d="M3.27222 16.647C3.87647 18.9021 4.17859 20.0296 4.86351 20.7609C5.40432 21.3383 6.10421 21.7424 6.87466 21.922C7.85044 22.1495 8.97798 21.8474 11.2331 21.2432C13.4881 20.6389 14.6157 20.3368 15.347 19.6519C15.8399 19.1902 16.2065 18.6126 16.415 17.9741M8.51621 6.44531C8.16368 6.53646 7.77741 6.63996 7.35077 6.75428C5.09569 7.35853 3.96815 7.66065 3.23687 8.34557C2.65945 8.88638 2.25537 9.58627 2.07573 10.3567C1.91482 11.0468 2.01883 11.8129 2.30728 13"
                    stroke={strokeColor}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill={svgfill} />
                <path d="M11.7769 10L16.6065 11.2941"
                    stroke={strokeColor}
                    strokeWidth="1.5"
                    strokeLinecap="round" />
                <path
                    d="M11 12.8975L13.8978 13.6739"
                    stroke={strokeColor}
                    strokeWidth="1.5"
                    strokeLinecap="round" />
            </svg>
            <span className="is-drawer-close:hidden">Complaints</span>
        </button>
    )
}


const ComplaintsDashboardRouteButton = () => {
    const router = useRouter()
    const handleClick = () => {
        router.push("/complaints/dashboard")
    }
    return (
        <button
        onClick={handleClick}
        aria-label='complaint dashboard' 
       
         type='button' 
         className='btn  btn-circle btn-lg'>
            <svg
                fill="currentColor"
                height={25}
                width={25}
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32" >
                <g id="SVGRepo_bgCarrier" strokeWidth={0.5}>
                </g>
                <g id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                </g>
                <g id="SVGRepo_iconCarrier">
                    <path d="M22,16c-4.4,0-8,3.6-8,8c0,1.6,0.5,3.2,1.4,4.6c0.2,0.3,0.5,0.4,0.8,0.4s0.6-0.2,0.8-0.4c0.7-1,1.7-1.8,2.9-2.2l4.3-6 c0.3-0.4,0.9-0.6,1.4-0.2c0.4,0.3,0.6,0.9,0.2,1.4L22.6,26c1.7,0.2,3.3,1.1,4.3,2.5c0.2,0.3,0.5,0.4,0.8,0.4c0.3,0,0.6-0.2,0.8-0.4 c0.9-1.3,1.4-2.9,1.4-4.6C30,19.6,26.4,16,22,16z"></path> <g> <path d="M12,24c0-5.5,4.5-10,10-10c3.3,0,6.2,1.6,8,4V7c0-1.7-1.3-3-3-3H5C3.3,4,2,5.3,2,7v18c0,1.7,1.3,3,3,3h7.8 C12.3,26.7,12,25.4,12,24z M12.1,7.6c0.1-0.1,0.1-0.2,0.2-0.3c0.4-0.4,1-0.4,1.4,0c0.1,0.1,0.2,0.2,0.2,0.3C14,7.7,14,7.9,14,8 c0,0.1,0,0.3-0.1,0.4c-0.1,0.1-0.1,0.2-0.2,0.3C13.5,8.9,13.3,9,13,9c-0.1,0-0.3,0-0.4-0.1c-0.1-0.1-0.2-0.1-0.3-0.2 c-0.1-0.1-0.2-0.2-0.2-0.3C12,8.3,12,8.1,12,8C12,7.9,12,7.7,12.1,7.6z M9.1,7.6c0.1-0.1,0.1-0.2,0.2-0.3c0.1-0.1,0.2-0.2,0.3-0.2 C10,6.9,10.4,7,10.7,7.3c0.1,0.1,0.2,0.2,0.2,0.3C11,7.7,11,7.9,11,8c0,0.3-0.1,0.5-0.3,0.7C10.5,8.9,10.3,9,10,9 C9.7,9,9.5,8.9,9.3,8.7C9.1,8.5,9,8.3,9,8C9,7.9,9,7.7,9.1,7.6z M6.3,7.3c0,0,0.1-0.1,0.1-0.1c0.1,0,0.1-0.1,0.2-0.1 C6.7,7,6.7,7,6.8,7c0.1,0,0.3,0,0.4,0c0.1,0,0.1,0,0.2,0.1c0.1,0,0.1,0.1,0.2,0.1c0,0,0.1,0.1,0.1,0.1c0.1,0.1,0.2,0.2,0.2,0.3 C8,7.7,8,7.9,8,8c0,0.1,0,0.3-0.1,0.4C7.9,8.5,7.8,8.6,7.7,8.7C7.5,8.9,7.3,9,7,9S6.5,8.9,6.3,8.7C6.1,8.5,6,8.3,6,8 C6,7.7,6.1,7.5,6.3,7.3z M7,14h5c0.6,0,1,0.4,1,1s-0.4,1-1,1H7c-0.6,0-1-0.4-1-1S6.4,14,7,14z M9,19H7c-0.6,0-1-0.4-1-1s0.4-1,1-1 h2c0.6,0,1,0.4,1,1S9.6,19,9,19z">
                    </path>
                    </g>
                </g>
            </svg>
        </button>
    )
}
export { ComplaintsRouteButton, ComplaintsDashboardRouteButton }