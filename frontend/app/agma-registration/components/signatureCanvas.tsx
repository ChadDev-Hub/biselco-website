"use client"
import React, { useEffect, useState, useRef } from 'react';

type Props = {
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

type LastPoint = {
    x: number;
    y: number;
}

const SignatureCanvas = ({canvasRef}: Props) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const lastPointRef = useRef<LastPoint | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Setup line styles
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';
  }, [canvasRef]);

  const getCoordinates = (e: React.TouchEvent<HTMLCanvasElement> | React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // Handle touch vs mouse
    let clientX: number;
    let clientY: number;

    if("touches" in e){
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    }else{
        clientX = e.clientX;
        clientY = e.clientY;
    }
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (
  e: React.TouchEvent<HTMLCanvasElement> | React.MouseEvent<HTMLCanvasElement>
) => {
  if (!canvasRef.current) return;

  const coords = getCoordinates(e);
  if (!coords) return;

  const { x, y } = coords;
  const ctx = canvasRef.current.getContext("2d");
  if (!ctx) return;

  ctx.beginPath();
  ctx.moveTo(x, y);

  // draw a dot so tap shows something
  ctx.arc(x, y, 1.5, 0, Math.PI * 2);
  ctx.fill();

  lastPointRef.current = { x, y };
  setIsDrawing(true);
};

  const draw = (
  e: React.TouchEvent<HTMLCanvasElement> | React.MouseEvent<HTMLCanvasElement>
) => {
  if (!isDrawing || !canvasRef.current) return;

  const coords = getCoordinates(e);
  if (!coords) return;

  const { x, y } = coords;
  const ctx = canvasRef.current.getContext("2d");
  if (!ctx) return;

  const last = lastPointRef.current;
  if (!last) {
    lastPointRef.current = { x, y };
    return;
  }

  const dx = x - last.x;
  const dy = y - last.y;
  const distance = Math.hypot(dx, dy);

  const steps = Math.max(1, Math.floor(distance / 2));

  ctx.beginPath();
  ctx.moveTo(last.x, last.y);

  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const ix = last.x + dx * t;
    const iy = last.y + dy * t;
    ctx.lineTo(ix, iy);
  }

  ctx.stroke();

  lastPointRef.current = { x, y };
};

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  
  return (
    <div className="w-full relative items-center gap-4  bg-base-100 rounded-xl shadow-lg ">
      <canvas
        ref={canvasRef}
        width={400}
        height={200}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        className="w-full  rounded-lg bg-white cursor-crosshair touch-none"
      />

      <div className="flex gap-2 w-full">
        <button
        type='button'
        
          onClick={clearCanvas} 
          className="btn btn-outline btn-circle btn-sm absolute top-2 right-2 btn-error flex-1"
        >
          X
        </button>
        
      </div>
    </div>
  );
};

export default SignatureCanvas;