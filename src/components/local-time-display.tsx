"use client";

import { useState, useEffect } from 'react';

export default function LocalTimeDisplay() {
  const [timeString, setTimeString] = useState<string>('');
  const [periodString, setPeriodString] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const currentPeriod = hours >= 12 ? 'PM' : 'AM';
      const displayHours = String(hours % 12 || 12).padStart(2, '0');

      setTimeString(`${displayHours}:${minutes}:${seconds}`);
      setPeriodString(currentPeriod);
    };

    updateClock(); // Initial call
    const intervalId = setInterval(updateClock, 1000);

    return () => clearInterval(intervalId); // Cleanup
  }, []);

  if (!timeString) {
    // Render a placeholder or nothing until the first update
    return (
        <div className="flex items-baseline text-primary" style={{fontVariantNumeric: 'tabular-nums'}}>
          <span className="text-10xl md:text-10xl font-bold">00:00:00</span>
          <span className="text-3xl md:text-5xl font-semibold ml-2 md:ml-4">AM</span>
        </div>
    );
  }

  return (
    <div className="flex items-baseline text-primary" style={{fontVariantNumeric: 'tabular-nums'}}>
      <span className="text-7xl md:text-9xl font-bold">{timeString}</span>
      <span className="text-3xl md:text-5xl font-semibold ml-2 md:ml-4">{periodString}</span>
    </div>
  );
}
