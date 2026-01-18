
import React from 'react'

type Props = {
    children: React.ReactNode;
    type?:"submit" | "reset" | "button";
    action?:()=>void
}

const LoginButton = ({children,type, action}: Props) => {
  return (
    <button className='btn btn-accent rounded-full w-30' type={type} onClick={action}>
        {children}
    </button>
  )
}

export default LoginButton;

