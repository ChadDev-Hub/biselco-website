"use client";
import React, { createContext, useRef, useContext} from "react";

type contextTYPE = {
  play_sound: (duration:number) => void;
  stop_sound: () => void;
};
const RouletteSoundContext = createContext<contextTYPE | null>(null);

type Props = {
  children: React.ReactNode;
};

const RouletteSound = ({ children }: Props) => {
  const soundRef = useRef<HTMLAudioElement>(null);
  
  const handlePlaySound = (duration: number) => {
    if (!soundRef.current) return;
    soundRef.current.src = `/sounds/${duration.toString()}s_spin.mp3`;
    soundRef.current.load();
    soundRef.current.play();

    
  };
  const handleStopSound = () => {
    if (!soundRef.current) return;
    soundRef.current.pause();
    soundRef.current.currentTime = 0;
  };
  
  return (
    <RouletteSoundContext.Provider
      value={{
        play_sound: (duration:number) => {
          handlePlaySound(duration);
        },
        stop_sound: () => {
          handleStopSound();
        },
      }}
    >
      <audio ref={soundRef}>
        <source  type="audio/mpeg" />
      </audio>
      {children}
    </RouletteSoundContext.Provider>
  );
};

export default RouletteSound;

export const useRouletteSound = () => {
  const context = useContext(RouletteSoundContext);
  if (!context) {
    throw new Error(
      "useRouletteSound must be used within a RouletteSoundProvider",
    );
  }
  return context;
};
