
"use client"

import {createContext, useState, useContext} from 'react'


type Props = {
    children: React.ReactNode
}

type LoadingState = {
    isLoading: boolean
    message?: string
}

type ContextType = {
    showLoading: (show: boolean, msg?: string) => void
}

const loadingContext = createContext<ContextType | null>(null)


const LoadingIndicator = ({children}: Props) => {
    const [isLoading, setIsLoading] = useState<LoadingState>({
        isLoading: false,
        message: "",
    });
    const showLoading = (show: boolean, msg?: string) => setIsLoading({isLoading: show, message: msg})
  return (
    <loadingContext.Provider value={{showLoading}}>
        {children}
        {isLoading.isLoading && 
        <div className="alert alert-info z-100 absolute right-1/2 min-w-60 translate-x-1/2 top-20 text-sm md:text-md lg:text-md">
            <span className='skeleton skeleton-text'>{isLoading.message}</span> <span className="loading loading-infinity loading-lg"></span>
        </div>}
    </loadingContext.Provider>
  )
}

export const useLoading = () => {
    const context = useContext(loadingContext)
    if (!context) {
        throw new Error("useLoading must be used within a LoadingProvider")
    }
    return context
}

export default LoadingIndicator;