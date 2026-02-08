"use client"
import React from 'react'

type Props = {}

const FabIcon = (props: Props) => {
    return (
        <div className="
        fab 
        fab-flower mb-20
        mr-1
        sm:mr-15
        lg:mr-25">
            {/* a focusable div with tabIndex is necessary to work on all browsers. role="button" is necessary for accessibility */}
            <div title='Tools' tabIndex={0} role="button" className="btn btn-lg  btn-circle btn-info">
                <svg width={25} height={25} viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" >
                <g id="SVGRepo_iconCarrier">
                        <path  d="M764.416 254.72a351.68 351.68 0 0 1 86.336 149.184H960v192.064H850.752a351.68 351.68 0 0 1-86.336 149.312l54.72 94.72-166.272 96-54.592-94.72a352.64 352.64 0 0 1-172.48 0L371.136 936l-166.272-96 54.72-94.72a351.68 351.68 0 0 1-86.336-149.312H64v-192h109.248a351.68 351.68 0 0 1 86.336-149.312L204.8 160l166.208-96h.192l54.656 94.592a352.64 352.64 0 0 1 172.48 0L652.8 64h.128L819.2 160l-54.72 94.72zM704 499.968a192 192 0 1 0-384 0 192 192 0 0 0 384 0z">
                        </path>
                    </g>
                    <g id="SVGRepo_bgCarrier" stroke-width="0">
                    </g>
                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#000000" stroke-width="38.912">
                        <path fill='#ffffff'  d="M764.416 254.72a351.68 351.68 0 0 1 86.336 149.184H960v192.064H850.752a351.68 351.68 0 0 1-86.336 149.312l54.72 94.72-166.272 96-54.592-94.72a352.64 352.64 0 0 1-172.48 0L371.136 936l-166.272-96 54.72-94.72a351.68 351.68 0 0 1-86.336-149.312H64v-192h109.248a351.68 351.68 0 0 1 86.336-149.312L204.8 160l166.208-96h.192l54.656 94.592a352.64 352.64 0 0 1 172.48 0L652.8 64h.128L819.2 160l-54.72 94.72zM704 499.968a192 192 0 1 0-384 0 192 192 0 0 0 384 0z">
                        </path>
                    </g>
                </svg>
            </div>

            {/* Main Action button replaces the original button when FAB is open */}
            <button title='Tools' type='button' className="fab-main-action btn btn-circle btn-lg">
                <svg width={25} height={25} viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" >
                <g id="SVGRepo_iconCarrier">
                        <path  d="M764.416 254.72a351.68 351.68 0 0 1 86.336 149.184H960v192.064H850.752a351.68 351.68 0 0 1-86.336 149.312l54.72 94.72-166.272 96-54.592-94.72a352.64 352.64 0 0 1-172.48 0L371.136 936l-166.272-96 54.72-94.72a351.68 351.68 0 0 1-86.336-149.312H64v-192h109.248a351.68 351.68 0 0 1 86.336-149.312L204.8 160l166.208-96h.192l54.656 94.592a352.64 352.64 0 0 1 172.48 0L652.8 64h.128L819.2 160l-54.72 94.72zM704 499.968a192 192 0 1 0-384 0 192 192 0 0 0 384 0z">
                        </path>
                    </g>
                    <g id="SVGRepo_bgCarrier" stroke-width="0">
                    </g>
                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#000000" stroke-width="38.912">
                        <path fill='currentColor'  d="M764.416 254.72a351.68 351.68 0 0 1 86.336 149.184H960v192.064H850.752a351.68 351.68 0 0 1-86.336 149.312l54.72 94.72-166.272 96-54.592-94.72a352.64 352.64 0 0 1-172.48 0L371.136 936l-166.272-96 54.72-94.72a351.68 351.68 0 0 1-86.336-149.312H64v-192h109.248a351.68 351.68 0 0 1 86.336-149.312L204.8 160l166.208-96h.192l54.656 94.592a352.64 352.64 0 0 1 172.48 0L652.8 64h.128L819.2 160l-54.72 94.72zM704 499.968a192 192 0 1 0-384 0 192 192 0 0 0 384 0z">
                        </path>
                    </g>
                </svg>
            </button>

            {/* buttons that show up when FAB is open */}
            <div className="tooltip tooltip-left" data-tip="Label A">
                <button type='button' className="btn btn-lg btn-circle">A</button>
            </div>
            <div className="tooltip tooltip-left" data-tip="Label B">
                <button type='button' className="btn btn-lg btn-circle">B</button>
            </div>
            <div className="tooltip" data-tip="Label C">
                <button type='button' className="btn btn-lg btn-circle">C</button>
            </div>
            <div className="tooltip" data-tip="Label D">
                <button type='button' className="btn btn-lg btn-circle">D</button>
            </div>
        </div>
    )
}

export default FabIcon;