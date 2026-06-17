"use client"
import React, {createContext,  useContext, useMemo} from 'react'


type Props = {
    children: React.ReactNode;
    initialUser: User
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
    user: User | undefined;
    // setUser: React.Dispatch<React.SetStateAction<User | undefined>>
}

const authContext = createContext<contextType | undefined>(undefined)
const AuthProvider = ({children, initialUser}: Props) => {
    // const [user, setUser] = useState<User | undefined>(initialUser)
    const user = useMemo(() => initialUser, [initialUser])
  return (
    <authContext.Provider value={{user}}>
        {children}
    </authContext.Provider>
  )
}

const useAuth = () => {
    const context = useContext(authContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within a AuthProvider");
    }
    return context
}

export {AuthProvider, useAuth}