"use client";

type Props = {
  children: React.ReactNode
}

const Tab = ({children}: Props) => {
  return (
    <div className="tabs tabs-lift">
      {children}
    </div>
  )
}

export default Tab