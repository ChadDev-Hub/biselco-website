
"use client"
import Link from 'next/link';
import {Info} from "lucide-react"
type Props = {
    is_active: boolean
}

const About = ({is_active}: Props) => {

  return (
    <Link className="is-drawer-close:tooltip is-drawer-close:tooltip-right items-center w-full" href="/about" type="button" data-tip="About us">
        <label className="flex gap-2">
            <Info className={`size-5 ${is_active ? "text-blue-500 drop-shadow-lg drop-shadow-blue-300" : ""}`}/>
            <span className={`is-drawer-close:hidden dock-label ${is_active ? "text-blue-500 " : ""}`}>About</span>
        </label>
        
        
    </Link>
  )
}

export default About;