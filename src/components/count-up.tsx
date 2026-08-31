import React, { useEffect, useState } from "react";
import { animate } from "framer-motion";

interface CountUpProps {
  value: number;
  duration?: number;
  separator?: string;
  className?: string;
  suffix?: string;
  colorScheme?: string;
}

export const CountUp: React.FC<CountUpProps> = ({
  value,
  duration = 2,
  separator = ",",
  className = "",
  suffix = "",
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration,
      onUpdate(val) {
        setCount(Math.round(val));
      },
    });
    return () => controls.stop();
  }, [value, duration]);

  const formattedCount = count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);

  return (
    <span className={className}>
      {formattedCount}
      {suffix}
    </span>
  );
};
