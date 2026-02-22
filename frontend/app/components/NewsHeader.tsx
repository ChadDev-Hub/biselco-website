"use client"

import Image from 'next/image';
import React from 'react'
import DeletePost from './deletePostButton';
type Props = {
  postId: number;
  author: string;
  first_name: string;
  last_name: string;
  profileUrl: string | undefined;
  date: string;
  time: string;
  period: string;
}

const NewsHeader = ({ postId,author, profileUrl, date, time, first_name, last_name, period }: Props) => {
  return (
    <div>
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center space-x-3">
          <Image
            loading='eager'
            className='rounded-full shadow drop-shadow-md'
            src={profileUrl ?? "https://img.daisyui.com/images/profile/demo/distracted1@192.webp"}
            alt='Profile'
            width={40}
            height={40}
          />
          <div>
            <h4 className="text-2xl font-bold text-yellow-300 leading-tight">
              <abbr className='cursor-help no-underline' title={`${author}`}>
                {first_name} {last_name}
              </abbr></h4>
            <p className="text-xs text-shadow-blue-500 italic">Date Posted: {date} • {time}</p>
            <div className="badge badge-sm badge-info">
              <svg className="size-[1em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g fill="currentColor" strokeLinejoin="miter" strokeLinecap="butt">
                  <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeLinecap="square" strokeMiterlimit="10" strokeWidth="2">
                  </circle>
                  <path d="m12,17v-5.5c0-.276-.224-.5-.5-.5h-1.5" fill="none" stroke="currentColor" strokeLinecap="square" strokeMiterlimit="10" strokeWidth="2">
                  </path>
                  <circle cx="12" cy="7.25" r="1.25" fill="currentColor" strokeWidth="2">
                  </circle>
                </g>
              </svg>
              {period}
            </div>
          </div>
        </div>
        <div className='dropdown dropdown-end'>
          <div aria-label='Post Option' className='btn btn-ghost btn-circle' role='button' tabIndex={0}>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" /></svg>
          </div>
          <ul tabIndex={-1} className="dropdown-content menu p-2  bg-base-100 rounded-box w-fit shadow-sm">
             <li>
              <DeletePost postId={postId}/>
             </li>
             <li>Edit</li>
          </ul>

        </div>
        

      </div>



    </div>


  )
}

export default NewsHeader;