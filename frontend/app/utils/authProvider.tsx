"use client"
import React, {createContext, useState, useEffect, useCallback, useContext} from 'react'
type Props = {
    children: React.ReactNode;
    initialUser: User | null
}

type errorUser = {
    status: number;
    detail: string;
}


type User = {
    username: string;
    user_id: number;
    role: string;
}

type contextType = {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>
}

const authContext = createContext<contextType | null>(null)
const AuthProvider = ({children, initialUser}: Props) => {
    const [user, setUser] = useState<User | null>(initialUser)
  return (
    <authContext.Provider value={{user, setUser}}>
        {children}
    </authContext.Provider>
  )
}

const useAuth = () => {
    const context = useContext(authContext)
    if (context === null) {
        throw new Error("useAuth must be used within a AuthProvider");
    }
    return context
}

export {AuthProvider, useAuth}