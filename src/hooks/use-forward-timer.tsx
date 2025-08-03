import { useState, useEffect } from 'react';

/**
 * Custom hook for forward timer counting from July 1, 2024
 * Returns formatted time string updating every second
 */
export const useForwardTimer = () => {
  const [timeString, setTimeString] = useState('');
  
  const startDate = new Date('2024-07-01T00:00:00Z');

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const diff = now.getTime() - startDate.getTime();
      
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      const months = Math.floor(days / 30.44); // Average days per month
      const years = Math.floor(months / 12);
      
      const displayYears = years;
      const displayMonths = months % 12;
      const displayDays = days % 30.44;
      const displayHours = hours % 24;
      const displayMinutes = minutes % 60;
      const displaySeconds = seconds % 60;
      
      const formatted = `${displayYears}y ${displayMonths}m ${Math.floor(displayDays)}d ${String(displayHours).padStart(2, '0')}:${String(displayMinutes).padStart(2, '0')}:${String(displaySeconds).padStart(2, '0')}`;
      
      setTimeString(formatted);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  return timeString;
};