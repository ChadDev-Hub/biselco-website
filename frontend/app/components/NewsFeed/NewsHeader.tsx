"use server"

import Image from 'next/image';
import React from 'react'
import DeletePostModal from './DeletePostModal';
type Props = {
  author: string;
  profileUrl: string;
  date: string;
  time: string;
}

const NewsHeader = async ({ author, profileUrl, date, time }: Props) => {
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
            <h4 className="text-2xl font-bold text-blue-800 leading-tight">{author}</h4>

          </div>

        </div>
        <button aria-label='PostOptions' type='button' className="text-gray-400 hover:text-gray-600 btn btn-ghost btn-circle">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" /></svg>
        </button>

      </div>
      <p className="text-xs text-gray-500 italic">Date Posted: {date} • {time}</p>

    </div>


  )
}

export default NewsHeader;