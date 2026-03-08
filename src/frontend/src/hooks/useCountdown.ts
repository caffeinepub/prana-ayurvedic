import { useEffect, useState } from "react";

// March 15, 2026 at 00:00 IST (UTC+5:30) = March 14, 2026 18:30 UTC
const LAUNCH_DATE = new Date("2026-03-14T18:30:00Z");

interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isLaunched: boolean;
}

function getTimeRemaining(): CountdownResult {
  const now = new Date();
  const diff = LAUNCH_DATE.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isLaunched: true };
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds, isLaunched: false };
}

export function useCountdown(): CountdownResult {
  const [state, setState] = useState<CountdownResult>(getTimeRemaining);

  useEffect(() => {
    const interval = setInterval(() => {
      setState(getTimeRemaining());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return state;
}
