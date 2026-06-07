"use client";
import React, { createContext, useRef, useContext } from "react";

type contextTYPE = {
  play_sound: () => void;
  stop_sound: () => void;
};
const RouletteSoundContext = createContext<contextTYPE | null>(null);

type Props = {
  children: React.ReactNode;
};
const RouletteSound = ({ children }: Props) => {
  const soundRef = useRef<HTMLAudioElement>(null);
  const handlePlaySound = () => {
    soundRef.current?.play();
  };
  const handleStopSound = () => {
    if (!soundRef.current) return;
    soundRef.current.pause();
    soundRef.current.currentTime = 0;
  };
  return (
    <RouletteSoundContext.Provider
      value={{
        play_sound: () => {
          handlePlaySound();
        },
        stop_sound: () => {
          handleStopSound();
        },
      }}
    >
      <audio ref={soundRef}>
        <source src="/sounds/roulette.mp3" type="audio/mpeg" />
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
