"use client"
import React from 'react'


type Props = {
    children: React.ReactNode;
}
const FabIcon = ({ children }: Props) => {
    return (
        <div className="
        fab 
        mb-20
        mr-1
        sm:mr-15
        lg:mr-25">
            {/* a focusable div with tabIndex is necessary to work on all browsers. role="button" is necessary for accessibility */}
            <div title='Tools' tabIndex={0} role="button" className="btn btn-lg  btn-circle btn-info">
                <svg width={25} height={25} viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" >
                    <g>
                        <path d="M764.416 254.72a351.68 351.68 0 0 1 86.336 149.184H960v192.064H850.752a351.68 351.68 0 0 1-86.336 149.312l54.72 94.72-166.272 96-54.592-94.72a352.64 352.64 0 0 1-172.48 0L371.136 936l-166.272-96 54.72-94.72a351.68 351.68 0 0 1-86.336-149.312H64v-192h109.248a351.68 351.68 0 0 1 86.336-149.312L204.8 160l166.208-96h.192l54.656 94.592a352.64 352.64 0 0 1 172.48 0L652.8 64h.128L819.2 160l-54.72 94.72zM704 499.968a192 192 0 1 0-384 0 192 192 0 0 0 384 0z">
                        </path>
                    </g>
                    <g strokeWidth={1}>
                    </g>
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#000000" strokeWidth="38.912">
                        <path fill='#ffffff' d="M764.416 254.72a351.68 351.68 0 0 1 86.336 149.184H960v192.064H850.752a351.68 351.68 0 0 1-86.336 149.312l54.72 94.72-166.272 96-54.592-94.72a352.64 352.64 0 0 1-172.48 0L371.136 936l-166.272-96 54.72-94.72a351.68 351.68 0 0 1-86.336-149.312H64v-192h109.248a351.68 351.68 0 0 1 86.336-149.312L204.8 160l166.208-96h.192l54.656 94.592a352.64 352.64 0 0 1 172.48 0L652.8 64h.128L819.2 160l-54.72 94.72zM704 499.968a192 192 0 1 0-384 0 192 192 0 0 0 384 0z">
                        </path>
                    </g>
                </svg>
            </div>

            <div className="fab-close">
                <span className="btn btn-circle btn-lg btn-error">
                    <svg
                        fill="currentColor"
                        width={25}
                        height={25}
                        viewBox="-8.5 0 32 32"
                        xmlns="http://www.w3.org/2000/svg"
                        transform="matrix(1, 0, 0, 1, 0, 0)rotate(270)">
                        <g id="SVGRepo_bgCarrier" strokeWidth={0.1}>
                        </g>
                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round">
                        </g>
                        <g id="SVGRepo_iconCarrier">
                            <path d="M15.281 7.188v17.594l-15.281-8.781z">
                            </path>
                        </g>
                    </svg>
                </span>
            </div>
            {children}
        </div>
    )
}

export default FabIcon;