"use client"
import { animate,useMotionValueEvent, motion, useMotionValue} from "framer-motion"
import { useState, useEffect } from "react";


const LandingStats = () => {

    // SERVE CONSUMER
    const servedConsumer = useMotionValue(0);
    const [count, setCount] = useState(0);

    useMotionValueEvent(servedConsumer, "change", (latest) => {
        setCount(Math.round(latest));
    });
    useEffect(() => {
    const controls = animate(servedConsumer, 20000, {
      duration: 4,
      ease: "easeInOut",
    });

    return () => controls.stop();
  }, [servedConsumer]);
    // GRID RELIABILITY
    const gridReliability = useMotionValue(0);
    const [reliability, setReliability] = useState(0);

    useMotionValueEvent(gridReliability, "change", (latest) => {
        setReliability((Number(latest.toFixed(1))));
    });
    useEffect(() => {
    const controls = animate(gridReliability, 99.8, {
      duration: 4,
      ease: "easeInOut",
    });

    return () => controls.stop();
  }, [gridReliability]);
    // RENEWABLE ENERGY
    const renewableEnergy = useMotionValue(0);
    const [energy, setEnergy] = useState(0);

    useMotionValueEvent(renewableEnergy, "change", (latest) => {
        setEnergy(Math.round(latest));
    });
    useEffect(() => {
    const controls = animate(renewableEnergy, 35, {
      duration: 4,
      ease: "easeInOut",
    });

    return () => controls.stop();
  }, [renewableEnergy]);
    return (
        <div className="container mx-auto px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="stats stats-vertical lg:stats-horizontal shadow-2xl bg-base-100 w-full border border-base-200"
            >
                <div className="stat p-8 place-items-center">
                    <div className="stat-title font-medium">Members Served</div>
                    <motion.pre className="stat-value text-primary">{count}+</motion.pre>
                    <div className="stat-desc font-bold">Community-Owned</div>
                </div>
                <div className="stat p-8 place-items-center">
                    <div className="stat-title font-medium">Grid Reliability</div>
                    <div className="stat-value text-secondary">{reliability}%</div>
                    <div className="stat-desc text-secondary">24/7 Monitoring</div>
                </div>
                <div className="stat p-8 place-items-center">
                    <div className="stat-title font-medium">Renewable Energy</div>
                    <div className="stat-value text-accent">{energy}%</div>
                    <div className="stat-desc">Growing Annually</div>
                </div>
            </motion.div>
        </div>
    )
}

export default LandingStats