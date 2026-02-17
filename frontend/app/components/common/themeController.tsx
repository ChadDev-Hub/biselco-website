"use client"

import {useState, useEffect} from 'react'

const ThemeController = () => {
    const [currentTheme, setTheme] = useState(() => {
            if (typeof window == "undefined") {
                return "cupcake"
            }
            const current = window.matchMedia("(prefers-color-scheme: dark)").matches ? "luxury" : "cupcake"
            document.documentElement.setAttribute("data-theme", current)
            return current
        })
        useEffect(() => {
            if (typeof window === "undefined") return
    
            const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    
            const handleThemeChange = (event: MediaQueryListEvent) => {
                setTheme(event.matches ? "luxury" : "cupcake")
            }
    
            // Modern browsers
            mediaQuery.addEventListener("change", handleThemeChange)
    
            // Cleanup
            return () => {
                mediaQuery.removeEventListener("change", handleThemeChange)
            }
        }, [])
    
        //  Automatica Theme Change
        useEffect(() => {
            document.documentElement.setAttribute("data-theme", currentTheme)
        }, [currentTheme])
  return (
    null
  )
}
export default ThemeController;