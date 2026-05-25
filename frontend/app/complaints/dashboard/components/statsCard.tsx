"use client";
import { useMotionValue, animate, useTransform,motion } from "framer-motion";
import React, { useEffect } from "react";

type Props = {
  label: string;
  value: number;
  svg: React.ReactNode;
  description: string;
  style?: Style;
  isPercentage?: boolean;
};
type Style = {
  descriptionClassName?: string;
  titleClass?: React.CSSProperties;
  valueClass?: React.CSSProperties;
};

const StatsCard = ({ label, value, svg, description, style, isPercentage }: Props) => {
  const motionVaue = useMotionValue(0);
  // const [count, setCount] = useState(0);
  const rounded = useTransform(motionVaue, (latest) => {
    return isPercentage ? `${latest.toFixed(2)}%` : Math.round(
      latest
    ).toString();
});
  // useMotionValueEvent(motionVaue, "change", (latest: number) => {
  //   setCount(Math.round(latest));
  // });

  useEffect(() => {
    const controls = animate(motionVaue, value, {
      duration: 2,
      ease: "easeInOut",
    });

    return () => controls.stop();
  }, [value, motionVaue]);
  return (
    <div className="stat w-full shadow-md">
      <div className="stat-figure">{svg}</div>
      <div className={`stat-title ${style?.titleClass} text-blue-700 text-xs  font-bold`}>
        {label}
      </div>
      <motion.div className={`stat-value ${style?.valueClass}  text-center text-sm`}>{rounded}</motion.div>
      <div className={`stat-desc  italic text-xs ${style?.descriptionClassName}`}> {description}</div>
    </div>
  );
};

export default StatsCard;
