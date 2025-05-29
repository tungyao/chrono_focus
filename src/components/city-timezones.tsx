"use client";

import { useState, useEffect } from 'react';

interface CityInfo {
  id: string;
  nameEn: string;
  nameZh: string;
  timeZone: string;
}

const CITIES: CityInfo[] = [
  { id: 'nyc', nameEn: 'New York', nameZh: '纽约', timeZone: 'America/New_York' },
  { id: 'lon', nameEn: 'London', nameZh: '伦敦', timeZone: 'Europe/London' },
  { id: 'par', nameEn: 'Paris', nameZh: '巴黎', timeZone: 'Europe/Paris' },
  { id: 'tok', nameEn: 'Tokyo', nameZh: '东京', timeZone: 'Asia/Tokyo' },
  { id: 'bei', nameEn: 'Beijing', nameZh: '北京', timeZone: 'Asia/Shanghai' },
  { id: 'syd', nameEn: 'Sydney', nameZh: '悉尼', timeZone: 'Australia/Sydney' },
];

interface DisplayCityTime {
  id: string;
  nameEn: string;
  nameZh: string;
  currentTime: string;
  timeDifference: string;
}

export default function CityTimezones() {
  const [cityTimes, setCityTimes] = useState<DisplayCityTime[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Component has mounted client-side

    const calculateTimes = () => {
      const now = new Date();
      // Calculate local offset in hours (e.g., -5 for UTC-5, +8 for UTC+8)
      // getTimezoneOffset returns minutes from UTC: positive for timezones west of UTC, negative for east.
      // So, UTC-5 is +300 minutes. UTC+8 is -480 minutes.
      // We want offset where positive means ahead of UTC. So, -offset/60.
      const localOffsetInHours = -now.getTimezoneOffset() / 60;

      const newCityTimes = CITIES.map(city => {
        let cityCurrentTime = "N/A";
        let cityOffsetInHours: number | null = null;
        let timeDifferenceFormatted = "N/A";

        try {
          cityCurrentTime = now.toLocaleTimeString('en-US', {
            timeZone: city.timeZone,
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          });

          // Intl.DateTimeFormat can give parts, including timeZoneName which can be an offset like GMT-7
          const formatterWithOffset = new Intl.DateTimeFormat('en-US', {
            timeZone: city.timeZone,
            // Requesting these parts helps ensure we get the offset info consistently
            year: 'numeric', month: 'numeric', day: 'numeric',
            hour: 'numeric', minute: 'numeric', second: 'numeric',
            timeZoneName: 'shortOffset', // Key for GMT+/-X format
          });
          const parts = formatterWithOffset.formatToParts(now);
          const gmtPart = parts.find(part => part.type === 'timeZoneName');
          
          if (gmtPart) {
            const offsetStr = gmtPart.value; // e.g., "GMT-7", "GMT+1"
            // Extract numeric value: parseFloat("GMT-7".replace("GMT","")) -> -7
            const numericOffsetValue = parseFloat(offsetStr.replace('GMT', '').replace('UTC', '')); // Also handle UTC prefix
            if (!isNaN(numericOffsetValue)) {
                 cityOffsetInHours = numericOffsetValue;
            }
          }
          
          if (cityOffsetInHours !== null) {
            const diff = cityOffsetInHours - localOffsetInHours;
            // Round to nearest half hour for display (e.g. India +5.5)
            const roundedDiff = Math.round(diff * 2) / 2;

            if (roundedDiff === 0) {
              timeDifferenceFormatted = '(Local)';
            } else {
              timeDifferenceFormatted = roundedDiff > 0 ? `+${roundedDiff}h` : `${roundedDiff}h`;
            }
          }
        } catch (error) {
          console.error(`Error processing timezone for ${city.nameEn}:`, error);
        }

        return {
          id: city.id,
          nameEn: city.nameEn,
          nameZh: city.nameZh,
          currentTime: cityCurrentTime,
          timeDifference: timeDifferenceFormatted,
        };
      });
      setCityTimes(newCityTimes);
    };

    calculateTimes(); // Initial calculation
    const intervalId = setInterval(calculateTimes, 60000); // Update every minute

    return () => clearInterval(intervalId); // Cleanup
  }, []);

  if (!isClient || !cityTimes.length) {
    // Show placeholders or loading state to avoid hydration mismatch and provide immediate structure
    return (
      <div className="w-full max-w-4xl mx-auto p-4 md:p-6">
        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {CITIES.map(city => (
            <li key={city.id} className="bg-card p-3 rounded-lg shadow animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/2 mb-1"></div>
              <div className="h-3 bg-muted rounded w-1/4"></div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6">
      <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm md:text-base">
        {cityTimes.map(city => (
          <li key={city.id} className="bg-card p-3 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 ease-in-out">
            <div className="font-semibold text-card-foreground truncate">{city.nameEn} / {city.nameZh}</div>
            <div className="text-muted-foreground">{city.currentTime}</div>
            <div className="text-xs text-accent">{city.timeDifference}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
