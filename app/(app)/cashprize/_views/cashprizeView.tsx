'use client';
import { ScratchToReveal } from '@/components/magicui/scratch-to-reveal';
import type { CashPrize } from '@/types/types';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Clock } from 'lucide-react';
import { useCountdown } from '@/context/countdownProvider';

export default function CashprizeView() {
  const [prize, setPrize] = useState<Omit<
    CashPrize,
    'created_at' | 'updated_at' | 'is_active' | 'probability'
  > | null>(null);
  const [loading, setLoading] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  const { countdown, formatTime, startCountdown } = useCountdown();

  useEffect(() => {
    setIsPageLoaded(true);
  }, []);

  const generatePrize = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cashprize');

      if (!res.ok) {
        throw new Error('Failed to fetch prize');
      }

      const data = await res.json();
      const { success, prize, timeRemaining } = data;
      console.log({ success, prize, timeRemaining });
      setPrize(prize);

      if (timeRemaining) {
        const seconds = timeToSeconds(timeRemaining);
        startCountdown(seconds);
      }
    } catch (error) {
      console.error('Error generating prize:', error);
    } finally {
      setLoading(false);
    }
  };

  const timeToSeconds = (timeStr: string) => {
    const regex = /(\d+)\s*min\s*(\d+)\s*sec/;
    const match = timeStr.match(regex);

    if (match) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      return minutes * 60 + seconds;
    }
    return 0;
  };

  const handleScratchComplete = () => {
    setRevealed(true);
  };

  return (
    <div className="mt-11 flex flex-col items-center gap-6 p-4">
      {countdown !== null && countdown > 0 && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-amber-600">
          <Clock className="h-5 w-5" />
          <span>Next prize available in: {formatTime(countdown)}</span>
        </div>
      )}

      {!prize && !countdown && isPageLoaded && (
        <Button
          className="text-lg"
          disabled={loading || (countdown !== null && countdown > 0)}
          size="lg"
          onClick={generatePrize}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Prize...
            </>
          ) : countdown !== null && countdown > 0 ? (
            'Wait for next prize'
          ) : (
            'Click to Generate Prize'
          )}
        </Button>
      )}

      {prize && (
        <div className="w-full max-w-md">
          <ScratchToReveal
            className="flex items-center justify-center overflow-hidden rounded-2xl border-2 bg-gray-100"
            gradientColors={['#A97CF8', '#F38CB8', '#FDCC92']}
            height={450}
            minScratchPercentage={30}
            width={450}
            onComplete={handleScratchComplete}
          >
            <div className="flex flex-col items-center justify-center p-4 text-center">
              <h2 className="mb-2 text-3xl font-bold">Congratulations!</h2>
              <p className="mb-4 text-xl">You've won:</p>
              <div className="text-primary mb-2 text-5xl font-bold">
                ${prize.prize_amount.toFixed(2)}
              </div>
              <p className="text-lg">{prize.prize_name || 'Cash Prize'}</p>
              {revealed && (
                <Button
                  className="mt-6 cursor-pointer"
                  variant="outline"
                  onClick={() => {
                    setPrize(null);
                    setRevealed(false);
                  }}
                >
                  Try Again
                </Button>
              )}
            </div>
          </ScratchToReveal>
        </div>
      )}
    </div>
  );
}
