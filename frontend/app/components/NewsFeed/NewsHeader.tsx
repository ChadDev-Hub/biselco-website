"use server"

import Image from 'next/image';
import React from 'react'
import DeletePostModal from './DeletePostModal';
type Props = {
  author: string;
  first_name: string;
  last_name: string;
  profileUrl: string;
  date: string;
  time: string;
  period: string;
}

const NewsHeader = async ({ author, profileUrl, date, time, first_name, last_name, period }: Props) => {
  return (
    <div>
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center space-x-3">
          <Image
            className='rounded-full'
            src={profileUrl}
            alt='Profile'
            width={30}
            height={30}
          />
          <div>
            <h4 className="text-2xl font-bold text-blue-800 leading-tight">
              <abbr className='cursor-help no-underline' title={`${first_name} ${last_name}`}>
                {author}
              </abbr></h4>
            <p className="text-xs text-gray-500 italic">Date Posted: {date} • {time}</p>
            <div className="badge badge-sm badge-info">
              <svg className="size-[1em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="currentColor" strokeLinejoin="miter" strokeLinecap="butt"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeLinecap="square" stroke-miterlimit="10" strokeWidth="2"></circle><path d="m12,17v-5.5c0-.276-.224-.5-.5-.5h-1.5" fill="none" stroke="currentColor" strokeLinecap="square" stroke-miterlimit="10" strokeWidth="2"></path><circle cx="12" cy="7.25" r="1.25" fill="currentColor" strokeWidth="2"></circle></g></svg>
              {period}
            </div>
          </div>

        </div>
        <button aria-label='PostOptions' type='button' className="text-gray-400 hover:text-gray-600 btn btn-ghost btn-circle">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" /></svg>
        </button>

      </div>



    </div>


  )
}

export default NewsHeader;