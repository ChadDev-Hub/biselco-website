"use client"
import React, {createContext, useState, useContext} from 'react'

type Props = {
    children: React.ReactNode;
    initialUser: User | null
}


type User = {
    id: string;
    user_name: string;
    email: string;
    first_name: string;
    last_name: string;
    roles: Roles[];
    photo: string;
}

type Roles = {
    id: number;
    name: string
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