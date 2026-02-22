'use client'
import React, {createContext, useRef, useContext,useEffect,useState} from 'react'
import { useAuth } from './authProvider'
type Props = {
    children: React.ReactNode;
}


type WSMessage = {
  detail: "news";
  data: NewsData;
} | {
  detail: "complaints";
  data: ComplaintData;
} | {
  detail: "complaint_status";
  data: ComplaintData;
} | {
  detail : "deleted_news";
  data: NewsData;
} | {
  detail: "deleted_complaint";
  data: ComplaintData;
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
        photo: string;
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
  const wsRef = useRef<WebSocket | null>(null)
  const WSURL = 'ws://localhost:8000/v1/socket/ws'
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttempts = useRef(0)
  useEffect(()=>{
    if(!user) return
    let isMounted = true
    const connect = () => {
      const ws = new WebSocket(WSURL)
      wsRef.current = ws

      ws.onopen = () => {
        reconnectAttempts.current = 0
      }


      ws.onmessage = (event) => {
          const message = JSON.parse(event.data);
          setMessage(message)
      }


       ws.onclose = (event) => {
        
        if (!isMounted) return
        console.log(event)
        // Exponential backoff (max 10s)
        const timeout = Math.min(1000 * 2 ** reconnectAttempts.current, 10000)
        reconnectAttempts.current += 1

        reconnectTimeout.current = setTimeout(() => {
          connect()
        }, timeout)}
      
      ws.onerror = () => {
        console.log("WS Error")
        ws.close()
      }

    }
    connect()
    return () => {
      isMounted = false
      wsRef.current?.close()
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current)
      }
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