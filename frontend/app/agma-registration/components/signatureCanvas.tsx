"use client";

import React, { useEffect} from "react";
import SignaturePad from "signature_pad";
type Props = {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  signaturePadRef: React.RefObject<SignaturePad | null>;
  clearError: () => void
};



const SignatureCanvas = ({ canvasRef, signaturePadRef, clearError }: Props) => {
  // Setup canvas once
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;

    // Fix blurry lines on retina screens
    const ratio = Math.max(window.devicePixelRatio || 1, 1);

    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;

    const ctx = canvas.getContext("2d");
    ctx?.scale(ratio, ratio);

    signaturePadRef.current = new SignaturePad(canvas, {
      minWidth: 1,
      maxWidth: 2,
      penColor: "black",
    });

    return () => {
      signaturePadRef.current?.off();
    };
  }, [canvasRef, signaturePadRef]);

  const clear = () => {
    signaturePadRef.current?.clear();
  };


  return (
    <div className="w-full h-fit relative bg-base-100 rounded-xl  shadow-lg">
      <canvas
        onPointerUp={clearError}
        ref={canvasRef}
        className="w-full min-h-64 rounded-box border-1  bg-white cursor-crosshair touch-one"
      />

      <button
        type="button"
        onClick={clear}
        className="btn btn-xs btn-circle btn-error absolute top-2 right-2"
      >
        X
      </button>
    </div>
  );
};

export default SignatureCanvas;