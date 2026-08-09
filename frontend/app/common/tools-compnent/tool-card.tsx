
"use client"
import React from 'react'
import Link from 'next/link'


type Props = {
    title: string,
    icon: React.ReactNode,
    href?: string
}

const ToolCard = ({ icon, title, href }: Props) => {
  return (
        <Link href={href ? href : "/"} className="bg-base-100 cursor-pointer p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-3 hover:bg-base-200 transition active:scale-95">
            <div className="p-3 bg-gray-50 rounded-full">
                {icon}
            </div>
            <span className="text-xs text-center font-semibold text-gray-700">{title}</span>
        </Link>
    );
}

export default ToolCard