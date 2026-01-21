import { createContext, useState, useContext } from "react";
import React from "react";
const AuthContext = createContext(null);


const baseUrl=process.env.BASESERVERURL
type Props = {
    children: React.ReactNode
}

export const authContext = ({ children }: Props) => {
    const [accessToken, setAccessToken] = useState<string | null>(null) 

    const login = () => {
        const Login = async (formdata: FormData) => {
            const body = new URLSearchParams({
                username: formdata.get("username") as string,
                password: formdata.get("password") as string
            }).toString();

            const fres = await fetch(`${baseUrl}/auth/token`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: body,
                    credentials: "include"
                }
            )
            const data = await fres.json()
            if (!fres.ok) {
                return { error: data.detail }
            }
            setAccessToken(data.access_token)
            return {
                detail: "Login Successful"
            }
        }

        const refresh = async() => {
            const res = await fetch(`${baseUrl}/auth/token/refresh`,
                {
                    method: "POST"
                    
                }
            )
        }
    }

    return (
        <AuthContext.Provider value={{ accessToken, login, refresh }}>
            {children}
        </AuthContext.Provider>
    )
}

