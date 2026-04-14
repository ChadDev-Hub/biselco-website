"use client"
import React, { useContext, createContext, useRef } from "react";

type Props = {
    children: React.ReactNode
}

type NotificationContextType = {
    playMessageNotification: () => void
}
const NotificationContext = createContext<NotificationContextType | null>(null)

const NotificationProvider = ({children}: Props) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const playMessageNotification = () => {
        if(!audioRef.current) return;
        audioRef.current.currentTime = 0;
        audioRef.current.play();
    }
  return (
    <NotificationContext.Provider value={{playMessageNotification}}>
        <audio ref={audioRef} src="/notif.mp3" />
        {children}
    </NotificationContext.Provider>
  )
};


const useNotification = () => {
    const context = useContext(NotificationContext)
    if(!context) throw new Error("useNotification must be used within a NotificationProvider")
    return context
}

export {NotificationProvider, useNotification}