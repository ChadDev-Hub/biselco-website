"use client";

import React, { useEffect, useRef, useState } from "react";

type Props = {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
};

type Point = {
  x: number;
  y: number;
};

const SignatureCanvas = ({ canvasRef }: Props) => {
  const [isDrawing, setIsDrawing] = useState(false);

  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const lastPointRef = useRef<Point | null>(null);

  // Setup canvas once
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;


    const dpr = window.devicePixelRatio || 1;

  const rect = canvas.getBoundingClientRect();

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000";

    ctxRef.current = ctx;
  }, [canvasRef]);

  const getCoordinates = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return null;

    const rect = canvasRef.current.getBoundingClientRect();

    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();

    const coords = getCoordinates(e);
    if (!coords) return;

    setIsDrawing(true);
    lastPointRef.current = coords;

    const ctx = ctxRef.current;
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);

    // small dot for tap
    ctx.arc(coords.x, coords.y, 1.5, 0, Math.PI * 2);
    ctx.fill();
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const coords = getCoordinates(e);
    if (!coords) return;

    const ctx = ctxRef.current;
    const last = lastPointRef.current;

    if (!ctx || !last) return;

    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();

    lastPointRef.current = coords;
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    lastPointRef.current = null;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="w-full relative bg-base-100 rounded-xl shadow-lg">
      <canvas
        ref={canvasRef}
        width={400}
        height={200}
        onPointerDown={startDrawing}
        onPointerMove={draw}
        onPointerUp={stopDrawing}
        onPointerCancel={stopDrawing}
        className="w-full rounded-lg bg-white cursor-crosshair touch-none"
      />

      <button
        type="button"
        onClick={clearCanvas}
        className="btn btn-circle btn-sm btn-error absolute top-2 right-2"
      >
        X
      </button>
    </div>
  );
};

export default SignatureCanvas;