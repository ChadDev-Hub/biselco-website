


import React from 'react'

type Props = {
    title: string;
    children: React.ReactNode[]; 
}

const SideContent = ({ title, children}: Props) => {
  return (
    <aside className="hidden lg:block lg:col-span-3 sticky top-8 ">
      <nav className="card bg-base-100 w-md shadow-sm border border-base-300 p-4 rounded-2xl">
        <h3 className="font-bold text-xs uppercase tracking-wider text-base-content/50 mb-3 px-3">
          {title}
        </h3>
        <ul className="space-y-1 text-sm">
          {children.map((child, index) => (
            <li key={index}>
                {child}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

export default SideContent