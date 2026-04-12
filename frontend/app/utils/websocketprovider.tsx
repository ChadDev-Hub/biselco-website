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
  detail: "complaints_admin";
  data: ComplaintData;
}
  |
{
  detail: "complaint_status";
  data: ComplaintData;
} | {
  detail : "deleted_news";
  data: NewsData;
} | {
  detail: "deleted_complaints";
  data: ComplaintData;
  
} | {
  detail: "presence";
  data: UserPresence;
} | {
  detail: "post_change_meter" | "deleted_change_meter";
  data: ChangeMeter[];
  total_page:number;
  stats: ChangeMeterStats[];
} | {
  detail: "complaint_message" | "sent_message";
  data: ComlaintMessage;
} | {
  detail: "seen_message";
  data: SeenMessage;
} | {
  detail: "complaint_stats";
  data: ComplaintStatsType[];
}

// COMPLAINT STATSD TYPE
type ComplaintStatsType = {
  id: number;
  title: string;
  value: number;
  description: string;
};


type SeenMessage = {
  unread: Unread;
  seen: Seen[];
}

type Seen = {
  id: string;
  complaints_id:number;
  receiver_status: string;
  receiver_id: string; 
}

type Unread = {
  complaints_id: number;
  unread_messages: number;
}

type ComlaintMessage = {
  id: string;
  complaints_id: number;
  message: string;
  receiver: User | undefined; 
  sender: User;
  sender_status: string;
  receiver_status: string;
  date: string;
  time: string;
}

type User ={
  id: string;
  user_name: string;
  email: string;
  first_name: string;
  last_name: string;
  roles: string[];
  photo: string;
}

type ChangeMeterStats= {
  title: string;
  value: number;
  description: string
}

type UserPresence = {
  "user_id": number;
  "user_status": string;
}


type ChangeMeter = {
  id: number;
  date_accomplished: string;
  account_no: string;
  consumer_name: string;
  location: string;
  pull_out_meter: string;
  pull_out_meter_reading: number;
  new_meter_serial_no: string;
  new_meter_brand: string;
  initial_reading: number;
  remarks: string;
  accomplished_by: string;
  geom: {
    type: string;
    coordinates: number[];
  };
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
    user_id: number;
    first_name:string;
    last_name:string;
    user_photo:string;
    subject: string;
    description: string;
    reference_pole: string;
    date_time_submitted: string;
    village: string; 
    municipality: string;
    user_status?:string;

    location: {
        latitude: number;
        longitude: number;
        srid: number;
    }
    status: [];
    status_history: [];
    latest_status?: string;
    resolution_time: string;
    unread_messages: number;

}

type WSContextType = {
  message: WSMessage | null;
  sendMessage: (data:unknown) => void
}

const WebsocketContext = createContext<WSContextType | undefined>(undefined)

const WebsocketProvider = ({children}: Props) => {
  const [message, setMessage] = useState<WSMessage | null>(null)
  const {user} = useAuth()
  const wsRef = useRef<WebSocket | null>(null)
  const WSURL = process.env.NEXT_PUBLIC_WEBSOCKET_URL as string
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttempts = useRef(0)
  useEffect(()=>{
    if(!user) return
    let isMounted = true
    const connect = () => {
      const ws = new WebSocket(`${WSURL}/v1/socket/ws`)
      wsRef.current = ws

      ws.onopen = () => {
        reconnectAttempts.current = 0
      }
      

      ws.onmessage = (event) => {
          const message = JSON.parse(event.data);
          setMessage(message)
      }


       ws.onclose = (event) => {
        console.log("WS Closed", event)
        if (!isMounted) return
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
  },[user, WSURL])


  const sendMessage = (data:unknown) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data))
    }
  }


  return (
    <WebsocketContext.Provider value={{message, sendMessage}}>
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