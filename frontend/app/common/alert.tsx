"use client"
import React,{useContext, useCallback, useState, use, useEffect} from 'react'


type Props ={
    children: React.ReactNode,
}

type AlertType = "success" | "error" | "warning" | "info" | "none"
type AlertState = {
    show: boolean;
    alertType: AlertType;
    message: string;

}
type contextType = {
    showAlert: (alertType: AlertType, message: string) => void
}

const AlertContext = React.createContext<contextType | null>(null)

const AlertComponent = ({children}: Props) => {
    const [alert, setAlert] = useState<AlertState>({
        show: false,
        message: "",
        alertType: "none"})

    const showAlert = useCallback((alertType: AlertType, message: string) => {
        setAlert({show: true, alertType, message})
    },[])
    useEffect(() => {
        if (alert.show) {
            const timeout = setTimeout(() => {
                setAlert({show: false, alertType: "none", message: ""})
            }, 3000)
            return () => clearTimeout(timeout)
        }
    })
    return (
        <AlertContext.Provider value={{showAlert}}>
        {children}
         {alert.show && <div role="alert" className={`alert alert-${alert.alertType} z-100 absolute right-1/2 min-w-60 translate-x-1/2 top-80 text-sm md:text-md lg:text-md`}>
            {alert.alertType === "error" &&<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>}
            {alert.alertType === "success" &&<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>}
            <span className='w-full'>{alert.message}</span>
        </div>}
        </AlertContext.Provider>
    )
}

export const useAlert = () => {
    const context = useContext(AlertContext)
    if (!context) {
        throw new Error("useAlert must be used within a AlertProvider")
    }
    return context
}


export default AlertComponent;