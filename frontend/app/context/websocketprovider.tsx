'use client'
import React, { createContext, useRef, useContext, useEffect, useState } from 'react'
import { useAuth } from './authProvider'
import { AgmaStatsType, AgmaVerificationType, TicketInfoType, CountPerMunicipality } from '../../types/agma';
import {Complaints, ComplaintStatusData, ComplaintMessage} from "@/types/complaints"
import {  ChangeMeterCreatedType } from '../../types/change-meter';
import { NewConnectionCreatedType} from '../../types/new-connection';
import {Stats} from "@/types/stats";
type Props = {
  children: React.ReactNode;
}


type WSMessage = {
  detail: "news";
  data: NewsData; 
} | {
  detail: "new_complaint";
  data: Complaints;
  total_page: number;
  stats: Stats[];
} | {
  detail: "complaints_admin";
  data: {
    data: Complaints;
    total_page: number;
  };
}
  |
{
  detail: "new_status";
  complaint_status: ComplaintStatusData;
  complaints_stats: Stats[];

} | {
  detail: "deleted_news";
  data: NewsData;
} | {
  detail: "deleted_complaints";
  data: Complaints;

} | {
  detail: "presence";
  data: UserPresence;
} | {
  detail: "post_change_meter"
  message: string;
  total_page: number;
  data: ChangeMeterCreatedType;
} | {
  detail: "deleted_change_meter";
  message: string;
  stats:  Stats[]
}
  |
{
  detail: "complaint_message"
  data: ComplaintMessage;
} | {
  detail: "seen_message";
  data: SeenMessage;
} | {
  detail: "complaints_stats";
  data: ComplaintStatsType[];
} | {
  detail: "sent_message";
  data: {
    new_message: ComplaintMessage;
    unread: Unread;
  }
} | {
  detail: "new_connection_created";
  total_page: number;
  message: string;
  data: NewConnectionCreatedType;
} | {
  detail: "new_connection_deleted"
} | {
  detail: "agma_setup";
  event_id: string;
  message: string;
  data: AgmaSetup;
} | {
  detail: "agma_cheds";
  event_id: string;
  message: string;
  data: EventSchedules[];
} | {
  detail: "new_registered";
  new_regs: TicketInfoType;
  new_stats: AgmaStats[];
  count_per_village: CountPerVillage[];
  registered_overtime: RegisteredOvertime[];
  registered_per_municipality: CountPerMunicipality[];
} | {
  detail: "agma_raffle_stats"
  data: AgmaStatsType;
} | {
  detail: "agma_verified_consumer",
  data : AgmaVerificationType
}
type RegisteredOvertime = {
  name: string;
  coron?: number;
  culion?: number;
  busuanga?: number;
  linapacan?: number; 
}
type CountPerVillage = {
  name: string;
  value?: number;
}
type AgmaStats = { 
  title: string;
  value: number;
  description: string;
  is_percentage: boolean
}

type EventSchedules = {
  id?: string | null;
  area?: string;
  event_location: string | null;
  event_date: string | null;
};


type AgmaSetup = {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  start_time: string;
  end_time: string;
}









// COMPLAINT STATSD TYPE
type ComplaintStatsType = {
  id: number;
  label: string;
  value: number;
  description: string;
};


type SeenMessage = {
  unread: Unread;
  seen: Seen[];
}

type Seen = {
  id: string;
  complaints_id: number;
  receiver_status: string;
  receiver_id: string;
}

type Unread = {
  complaints_id: number;
  unread_messages: number;
  sender_id: string;
}






type UserPresence = {
  "user_id": number;
  "user_status": string;
}



// NEWS
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


type WSContextType = {
  message: WSMessage | null;
  sendMessage: (data: unknown) => void
  clearMessage: () => void
}

const WebsocketContext = createContext<WSContextType | undefined>(undefined)

const WebsocketProvider = ({ children }: Props) => {
  const [message, setMessage] = useState<WSMessage | null>(null)
  const { user } = useAuth()
  
  const wsRef = useRef<WebSocket | null>(null)
  const WSURL = process.env.NEXT_PUBLIC_WEBSOCKET_URL as string
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttempts = useRef(0)
  useEffect(() => {
    if (!user) return
    let isMounted = true
    const connect = () => {
      const ws = new WebSocket(`${WSURL}`)
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
        }, timeout)
      }

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
  }, [user, WSURL])


  const sendMessage = (data: unknown) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data))
    }
  }

  const clearMessage = () => {
    setMessage(null)
  }

  return (
    <WebsocketContext.Provider value={{ message, sendMessage, clearMessage }}>
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
export { WebsocketProvider, useWebsocket };