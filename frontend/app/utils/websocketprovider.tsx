'use client'
import React, {createContext, useContext,useEffect,useState} from 'react'
import { useAuth } from './authProvider'
type Props = {
    children: React.ReactNode;
}


type WSMessage = {
  detail: "news"
  data: NewsData;
} | {
  detail: "complaints"
  data: ComplaintData
} | {
  detail: "complaints status"
  data: ComplaintData
}

type NewsData = {
  id: number
    title: string;
    date_posted: string;
    description: string;
    time_posted: string;
    period: string;
    user: {
        id: number;
        user_name: string;
        last_name: string;
        first_name: string;
    },
    news_images: string[]
}

type ComplaintData = {
    id: number;
    user_id : number;
    first_name:string;
    last_name:string;
    subject: string;
    description: string;
    village: string; 
    municipality: string;
    location: {
        latitude: number;
        longitude: number;
        srid: number;
    }
    status: [];

}



const WebsocketContext = createContext<WSMessage | null>(null)

const WebsocketProvider = ({children}: Props) => {
  const [message, setMessage] = useState<WSMessage | null>(null)
  const {user, setUser} = useAuth()
  useEffect(()=>{
    if(!user) return
    const ws = new WebSocket('ws://localhost:8000/socket/ws')
    ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        setMessage(message)
    }
    return () => {
        ws.close()
    }
  },[user])
  return (
    <WebsocketContext.Provider value={message}>
        {children}
    </WebsocketContext.Provider>
  )
}

const useWebsocket = () => {
  const context = useContext(WebsocketContext);
  if (context === undefined) {
    throw new Error("useWebsocket must be used within a WebsocketProvider");
  }
  return context
}
export {WebsocketProvider, useWebsocket};