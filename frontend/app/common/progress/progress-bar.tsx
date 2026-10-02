
"use client"
import Nprogress from 'nprogress'
import {useEffect} from 'react'
const ProgressBar = () => {
    useEffect(() => {
        const handleNavigate = (event:MouseEvent) =>{
            const target = event.target as HTMLElement;
            const link = target.closest('a');
            if(!link) return
            const href = link.getAttribute('href');
            if(!href ||
            href.startsWith("http") || href.startsWith("#") || link.target === "_blank") {
                return
            }
            Nprogress.start();
        }
       document.addEventListener('click', handleNavigate);
       return () => {
        document.removeEventListener('click', handleNavigate);
       } 
    },[])
  return null
}

export default ProgressBar