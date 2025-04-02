import { useCountdown } from '@/context/countdownProvider';
import React from 'react';

export default function CountDownCase() {
  const { countdown, formatTime } = useCountdown();

  return (
    <div>
      <p className="text-sm text-slate-500">Prochain ticket</p>
      <p className="text-xl font-bold text-blue-700">
        {countdown !== null ? formatTime(countdown) : '--:--:--'}
      </p>
    </div>
  );
}
