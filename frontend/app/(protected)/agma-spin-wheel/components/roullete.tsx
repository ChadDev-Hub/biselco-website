"use client";

import { useMemo, useRef, useState, use } from "react";
import { Lightbulb } from "lucide-react";
import { AgmaSpinRoulette } from "../../../actions/agma";
import { useRouletteSound } from "./rouletSound";
import { useSearchParams } from "next/navigation";
import WinnerModal from "./winner-modal";
import { useAlert } from "../../../common/alert";
const SIZE = 500;
const RADIUS = 240;

// Modern color palette matrix for a rich gradient sequence
const COLORS = [
  "#6366f1",
  "#4f46e5",
  "#3b82f6",
  "#2563eb",
  "#06b6d4",
  "#0891b2",
  "#10b981",
  "#059669",
];

function polarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  angle: number,
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
  endAngle: number,
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
type PromiseType = {
  status: number;
  error?: string;
  data?: string[];
};

type Props = {
  promise: Promise<PromiseType>;
};

export default function WheelPage({ promise }: Props) {
  const InitialEntries = use(promise);
  const searchParams = useSearchParams();
  const spinTimer = searchParams.get("spin_time");
  const [entries, setEntries] = useState<string[]>(InitialEntries.data || []);
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isPreparing, setPreparing] = useState(false);
  const { play_sound, stop_sound } = useRouletteSound();
  const { showAlert } = useAlert();
  // Track provisional selection vs displayed modal state
  const [pendingWinner, setPendingWinner] = useState("");

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
        color: COLORS[index % COLORS.length],
      };
    });
  }, [sliceAngle, entries]);

  const spin = async () => {
    if (isSpinning) return;
    stop_sound();
    setShowWinnerModal(false);
    setPreparing(true);
    const data = await AgmaSpinRoulette();
    if (data?.status === 404) {
      showAlert("warning", data.data);
      stop_sound();
      setShowWinnerModal(false);
      setIsSpinning(false);
      return;
    }
    setPreparing(false);
    setIsSpinning(true);
    play_sound(Number(spinTimer));
    setEntries(data?.data.entries);
    const winnerIndex = data?.data.pending_winner_idx;

    // Calculate precise target angle so selected index lands perfectly at the top pointer (0 deg offsets)
    const targetAngle = 360 - (winnerIndex * sliceAngle + sliceAngle / 2);

    // Smooth multi-spin accumulation
    const totalRotation =
      currentRotationRef.current +
      360 * 8 +
      targetAngle -
      (currentRotationRef.current % 360);
    currentRotationRef.current = totalRotation;

    setPendingWinner(data?.data.pending_winner);
    setRotation(totalRotation);

    // Sync modal appearance timing exactly with the CSS transition length (5000ms)
    setTimeout(
      () => {
        setIsSpinning(false);
        setShowWinnerModal(true);
      },
      Number(spinTimer) * 1000,
    );
  };
  const removeitemfromEntries = (account_no: string) => {
    const updatedEntries = entries.filter((entry) => entry !== account_no);
    setEntries(updatedEntries);
  };
  return (
    <>
      {/* Dynamic Ambient Background Glows */}

      {/* Main Wheel Viewport Frame */}
      <div className="relative z-10   flex flex-col items-center">
        {/* Top Pointer Indicator Element */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-30 drop-shadow-[0_4px_10px_rgba(244,63,94,0.5)] animate-bounce">
          <div className="w-0 h-0 border-l-14 border-l-transparent border-r-14 border-r-transparent border-t-24 border-t-rose-500" />
          <Lightbulb className="absolute  top-20 sm:top-24 xl:top-26 left-1/2 -translate-x-1/2 fill-amber-400 text-amber-300 rotate-180 size-3.5 shadow-2xl" />
        </div>

        {/* High-Tech Outer Ring Frame */}
        <div className="p-3 bg-slate-900/80 backdrop-blur-md rounded-full shadow-[0_0_60px_rgba(99,102,241,0.15)] border border-slate-800 ring-4 ring-slate-800/40">
          <div
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: `transform ${spinTimer}s cubic-bezier(0.15, 0.85, 0.35, 1)`,
            }}
            className={`will-change-transform`}
          >
            <svg
              width={SIZE}
              height={SIZE}
              viewBox="-300 -300 600 600"
              className="w-75 h-75 sm:w-105 sm:h-105 md:w-125 md:h-125  select-none"
            >
              <defs>
                <radialGradient id="wheelOverlay" cx="50%" cy="50%" r="50%">
                  <stop offset="70%" stopColor="#000000" stopOpacity="0" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0.35" />
                </radialGradient>
              </defs>

              <g>
                {slices.map((slice, index) => (
                  <g
                    key={index}
                    className="transition-opacity duration-300 hover:opacity-95"
                  >
                    {/* Segment Arc */}
                    <path
                      d={describeArc(
                        0,
                        0,
                        RADIUS,
                        slice.startAngle,
                        slice.endAngle,
                      )}
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
              <circle
                r={RADIUS}
                fill="url(#wheelOverlay)"
                pointerEvents="none"
              />
            
              {/* Polished Core Hub */}
              <circle
                r="45"
                fill="#0f172a"
                stroke="#334155"
                strokeWidth="4"
                className="shadow-xl"
              />
              <circle r="38" fill="#1e293b" />
              
              <circle r="12" fill="#6366f1" className="animate-pulse" />
            </svg>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={spin}
          disabled={isSpinning || isPreparing}
          className={`btn mt-10 px-10 py-4 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 font-bold text-base text-white rounded-full shadow-lg shadow-indigo-500/20 tracking-wider uppercase transform active:scale-95 transition-all duration-300 border border-indigo-400/20
            ${isSpinning || isPreparing ? "opacity-40 cursor-not-allowed saturate-50 scale-95" : "hover:brightness-110 hover:shadow-purple-500/30 hover:-translate-y-0.5"}`}
        >
          {isPreparing ? (
            <span className="skeleton skeleton-text">Preparing to Spin...</span>
          ) : isSpinning ? (
            "Selecting Winner..."
          ) : (
            "Spin Roulette"
          )}
        </button>
      </div>

      {/* WINNER VIEW WINDOW (MODAL DIALOG) */}
      {showWinnerModal && (
        <WinnerModal
          removeWinerEntry={removeitemfromEntries}
          winner_account={pendingWinner}
          showModal={setShowWinnerModal}
        />
      )}
    </>
  );
}
