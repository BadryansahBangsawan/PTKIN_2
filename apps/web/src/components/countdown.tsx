"use client";

import { useEffect, useRef, useState } from "react";
import { useAnimate } from "framer-motion";

const DEFAULT_TARGET_DATE = "2026-10-01T00:00:00";

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

type CountdownUnit = "Day" | "Hour" | "Minute" | "Second";

type CountdownProps = {
  targetDate?: Date | string;
  className?: string;
};

type CountdownItemProps = {
  unit: CountdownUnit;
  label: string;
  targetDate: Date | string;
  isLast?: boolean;
};

export default function ShiftingCountdown({
  targetDate = DEFAULT_TARGET_DATE,
  className,
}: CountdownProps) {
  return (
    <div
      className={[
        "flex w-full max-w-4xl items-stretch rounded-2xl border border-white/20 bg-transparent backdrop-blur-[1px]",
        className ?? "",
      ]
        .join(" ")
        .trim()}
    >
      <CountdownItem unit="Day" label="Days" targetDate={targetDate} />
      <CountdownItem unit="Hour" label="Hours" targetDate={targetDate} />
      <CountdownItem unit="Minute" label="Minutes" targetDate={targetDate} />
      <CountdownItem unit="Second" label="Seconds" targetDate={targetDate} isLast />
    </div>
  );
}

function CountdownItem({ unit, label, targetDate, isLast = false }: CountdownItemProps) {
  const { ref, time } = useTimer(unit, targetDate);
  const display = unit === "Second" ? String(time).padStart(2, "0") : time;

  return (
    <div
      className={[
        "flex flex-1 flex-col items-center justify-center gap-1 px-3 py-4 md:gap-2 md:px-4 md:py-5",
        !isLast ? "border-r border-white/15" : "",
      ]
        .join(" ")
        .trim()}
    >
      <div className="relative w-full overflow-hidden text-center">
        <span
          ref={ref}
          className="block text-2xl font-mono font-semibold text-white drop-shadow-sm sm:text-3xl md:text-4xl lg:text-5xl"
        >
          {display}
        </span>
      </div>
      <span className="text-[10px] uppercase tracking-[0.18em] text-white/80 sm:text-xs md:text-sm">
        {label}
      </span>
    </div>
  );
}

function useTimer(unit: CountdownUnit, targetDate: Date | string) {
  const [ref, animate] = useAnimate();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeRef = useRef(0);
  const [time, setTime] = useState(0);

  useEffect(() => {
    const target = typeof targetDate === "string" ? new Date(targetDate) : targetDate;
    const targetTimestamp = target.getTime();

    const handleCountdown = async () => {
      const nowTimestamp = Date.now();
      const distance = Math.max(0, targetTimestamp - nowTimestamp);

      let newTime = 0;
      switch (unit) {
        case "Day":
          newTime = Math.floor(distance / DAY);
          break;
        case "Hour":
          newTime = Math.floor((distance % DAY) / HOUR);
          break;
        case "Minute":
          newTime = Math.floor((distance % HOUR) / MINUTE);
          break;
        case "Second":
          newTime = Math.floor((distance % MINUTE) / SECOND);
          break;
      }

      if (newTime === timeRef.current) return;

      if (!ref.current) {
        timeRef.current = newTime;
        setTime(newTime);
        return;
      }

      await animate(ref.current, { y: ["0%", "-50%"], opacity: [1, 0] }, { duration: 0.25 });

      timeRef.current = newTime;
      setTime(newTime);

      await animate(ref.current, { y: ["50%", "0%"], opacity: [0, 1] }, { duration: 0.25 });
    };

    void handleCountdown();
    intervalRef.current = setInterval(() => {
      void handleCountdown();
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [animate, ref, targetDate, unit]);

  return { ref, time };
}
