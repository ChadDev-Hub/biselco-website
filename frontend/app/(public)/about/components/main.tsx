"use client"
import React from 'react'

type Props = {
    children: React.ReactNode
}

const Main = ({children}: Props) => {
  return (
    <main className="max-w-6xl mx-auto px-4 py-12 space-y-16">
        {children}
    </main>
  )
}

export default Main