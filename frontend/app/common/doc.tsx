
"use client"
import { usePathname } from 'next/navigation'
import React, { } from 'react'
import { ComplaintsRouteButton } from './buttons/complaints'
import { HomeRouteButton } from './buttons/home'
const DocNavigation = () => {
  const currentRoute = usePathname()
  const isActive = currentRoute === "/" ? "home"
    : currentRoute === "/complaints" ? "complaints" : "logout";
  return (

    <div className={`fixed bottom-6  w-full px-4 flex  justify-between items-end lg:hidden ${currentRoute === "/landing" ? "hidden" : "visible"}`}>

      {/* Left Island: Main Navigation */}
      <div className="dock dock-sm relative bg-base-100/45 glass rounded-full backdrop-blur-md shadow-lg  mr-4">

        <div className={isActive === "home" ? "dock-active" : ""}>
          <HomeRouteButton
          strokeColor={isActive === "home" ? "currentColor" : "currentColor"}
          svgfill={isActive === "home" ? "#D4F6FF" : "None"}
          orientation='flex flex-col' />

        </div>
        
        <div className={`${isActive === "complaints" ? "dock-active" : ""}`}>
          <ComplaintsRouteButton
          strokeColor={isActive === "complaints" ? "currentColor" : "currentColor"}
          svgfill={isActive === "complaints" ? "#D4F6FF" : "None"}
          orientation='flex flex-col' />
          
        </div>
        

        {/* <button type='button' onClick={handleSettingsClick} className={`${active === "settings" ? "dock-active" : ""}`}>
          <svg className="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill={`${active === "settings" ? "lightblue" : "none"}`} strokeLinejoin="miter" strokeLinecap="butt"><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeLinecap="square" strokeMiterlimit="10" strokeWidth="2"></circle><path d="m22,13.25v-2.5l-2.318-.966c-.167-.581-.395-1.135-.682-1.654l.954-2.318-1.768-1.768-2.318.954c-.518-.287-1.073-.515-1.654-.682l-.966-2.318h-2.5l-.966,2.318c-.581.167-1.135.395-1.654.682l-2.318-.954-1.768,1.768.954,2.318c-.287.518-.515,1.073-.682,1.654l-2.318.966v2.5l2.318.966c.167.581.395,1.135.682,1.654l-.954,2.318,1.768,1.768,2.318-.954c.518.287,1.073.515,1.654.682l.966,2.318h2.5l.966-2.318c.581-.167,1.135-.395,1.654-.682l2.318.954,1.768-1.768-.954-2.318c.287-.518.515-1.073.682-1.654l2.318-.966Z" fill="none" stroke="currentColor" strokeLinecap="square" strokeMiterlimit="10" strokeWidth="2"></path></g></svg>
          <span className="dock-label">Settings</span>
        </button> */}
      </div>

      {/* Right Island: Menu Button */}
      <div className="dock dock-sm relative bg-base-100/45 flex-1 rounded-full backdrop-blur-md shadow-lg px-4">
        <label htmlFor="my-drawer-4" aria-label="open sidebar" className={`flex flex-col items-center justify-center cursor-pointer`}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className="size-[1.2em]"><path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path><path d="M9 4v16"></path><path d="M14 10l2 2l-2 2"></path></svg>
          <span className="dock-label">Menu</span>
        </label>
      </div>
    </div>



  )
}

export default DocNavigation