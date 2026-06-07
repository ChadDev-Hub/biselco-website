"use client";

import { useMemo, useRef, useState} from "react";
import { Zap, Trophy, X } from "lucide-react";

const SIZE = 500;
const RADIUS = 240;

const entries = Array.from({length: 100}, (_,index)=> `Consumer ${index}`)

// Modern color palette matrix for a rich gradient sequence
const COLORS = [
  "#6366f1", "#4f46e5", "#3b82f6", "#2563eb", 
  "#06b6d4", "#0891b2", "#10b981", "#059669"
];

function polarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  angle: number
) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad),
  };
}

function describeArc(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number
) {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    `M ${cx} ${cy}`,
    `L ${start.x} ${start.y}`,
    `A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
    "Z",
  ].join(" ");
}

export default function WheelPage() {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  
  // Track provisional selection vs displayed modal state
  const [pendingWinner, setPendingWinner] = useState("");
  console.log(pendingWinner);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  
  const currentRotationRef = useRef(0);
  const sliceAngle = 360 / entries.length;

  const slices = useMemo(() => {
    return entries.map((label, index) => {
      const startAngle = index * sliceAngle;
      const endAngle = startAngle + sliceAngle;
      const middle = startAngle + sliceAngle / 2;
      // Push text slightly further out toward the radius rim
      const textPos = polarToCartesian(0, 0, 170, middle);

      return {
        label,
        startAngle,
        endAngle,
        middle,
        textPos,
        color: COLORS[index % COLORS.length]
      };
    });
  }, [sliceAngle]);

  const spin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setShowWinnerModal(false);

    const winnerIndex = Math.floor(Math.random() * entries.length);
    
    // Calculate precise target angle so selected index lands perfectly at the top pointer (0 deg offsets)
    const targetAngle = 360 - (winnerIndex * sliceAngle + sliceAngle / 2);
    
    // Smooth multi-spin accumulation 
    const totalRotation = currentRotationRef.current + (360 * 8) + targetAngle - (currentRotationRef.current % 360);
    currentRotationRef.current = totalRotation;
    
    setPendingWinner(entries[winnerIndex]);
    setRotation(totalRotation);

    // Sync modal appearance timing exactly with the CSS transition length (5000ms)
    setTimeout(() => {
      setIsSpinning(false);
      setShowWinnerModal(true);
    }, 5000);
  };

  return (
  <>
  {/* Dynamic Ambient Background Glows */}
      
      

      

      {/* Main Wheel Viewport Frame */}
      <div className="relative z-10 flex flex-col items-center">
        
        {/* Top Pointer Indicator Element */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-30 drop-shadow-[0_4px_10px_rgba(244,63,94,0.5)] animate-bounce">
          <div className="w-0 h-0 border-l-14 border-l-transparent border-r-14 border-r-transparent border-t-24 border-t-rose-500" />
          <Zap className="absolute top-26 left-1/2 -translate-x-1/2 fill-amber-400 text-amber-300 size-5" />
        </div>

        {/* High-Tech Outer Ring Frame */}
        <div className="p-4 bg-slate-900/80 backdrop-blur-md rounded-full shadow-[0_0_60px_rgba(99,102,241,0.15)] border border-slate-800 ring-4 ring-slate-800/40">
          <div
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: "transform 5s cubic-bezier(0.15, 0.85, 0.35, 1)",
            }}
            className="will-change-transform"
          >
            <svg
              width={SIZE}
              height={SIZE}
              viewBox="-300 -300 600 600"
              className="w-[300px] h-[300px] sm:w-[420px] sm:h-[420px] md:w-[500px] md:h-[500px] select-none"
            >
              <defs>
                <radialGradient id="wheelOverlay" cx="50%" cy="50%" r="50%">
                  <stop offset="70%" stopColor="#000000" stopOpacity="0" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0.35" />
                </radialGradient>
              </defs>

              <g>
                {slices.map((slice, index) => (
                  <g key={index} className="transition-opacity duration-300 hover:opacity-95">
                    {/* Segment Arc */}
                    <path
                      d={describeArc(0, 0, RADIUS, slice.startAngle, slice.endAngle)}
                      fill={slice.color}
                      stroke="#0f172a"
                      strokeWidth="2.5"
                    />

                    {/* Rotated Segment Text */}
                    <text
                      x={slice.textPos.x}
                      y={slice.textPos.y}
                      fontSize="10"
                      fontWeight="700"
                      fill="#ffffff"
                      letterSpacing="0.05em"
                      textAnchor="end"
                      dominantBaseline="middle"
                      transform={`rotate(${slice.middle - 90} ${slice.textPos.x} ${slice.textPos.y})`}
                    >
                      {slice.label}
                    </text>
                  </g>
                ))}
              </g>

              {/* Shading layer for depth appearance */}
              <circle r={RADIUS} fill="url(#wheelOverlay)" pointerEvents="none" />

              {/* Polished Core Hub */}
              <circle r="45" fill="#0f172a" stroke="#334155" strokeWidth="4" className="shadow-xl" />
              <circle r="38" fill="#1e293b" />
              <circle r="12" fill="#6366f1" className="animate-pulse" />
            </svg>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={spin}
          disabled={isSpinning}
          className={`mt-10 px-10 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 font-bold text-base text-white rounded-full shadow-lg shadow-indigo-500/20 tracking-wider uppercase transform active:scale-95 transition-all duration-300 border border-indigo-400/20
            ${isSpinning ? "opacity-40 cursor-not-allowed saturate-50 scale-95" : "hover:brightness-110 hover:shadow-purple-500/30 hover:-translate-y-0.5"}`}
        >
          {isSpinning ? "Selecting Winner..." : "Spin Roulette"}
        </button>
      </div>

      {/* WINNER VIEW WINDOW (MODAL DIALOG) */}
      {showWinnerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md transition-all duration-300 animate-in fade-in">
          
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl relative transform transition-all duration-300 scale-100 animate-in zoom-in-95">
            
            {/* Close Cross icon corner button */}
            <button 
              type="button"
              title="close modal"
              onClick={() => setShowWinnerModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="size-5" />
            </button>

            {/* Glowing Trophy Icon Ring */}
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-xl shadow-orange-500/20 mb-5 transform rotate-3">
              <Trophy className="size-10 stroke-[2.5]" />
            </div>

            <span className="text-xs font-bold tracking-widest text-indigo-400 uppercase">
              Draw Completed
            </span>
            
            <h2 className="text-3xl font-black text-white mt-1 mb-4 tracking-tight">
              {pendingWinner}
            </h2>

            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Congratulations! This account node has been drawn successfully out of the total pool entries.
            </p>

            {/* Modal Actions */}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setShowWinnerModal(false)
                  console.log("Pending Winner is Sending to Backend")}
                }
                className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-white font-bold rounded-xl transition-all shadow-md shadow-emerald-950/50"
              >
                Confirm Reward
              </button>
              <button
                onClick={() => setShowWinnerModal(false)}
                className="w-full py-2.5 bg-transparent hover:bg-slate-800 text-slate-400 hover:text-white font-semibold rounded-xl transition-all text-sm"
              >
                Dismiss Window
              </button>
            </div>
          </div>
        </div>
      )}
  </>
      
   
  );
}