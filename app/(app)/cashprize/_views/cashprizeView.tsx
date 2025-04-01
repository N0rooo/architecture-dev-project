"use client"
import { ScratchToReveal } from "@/components/magicui/scratch-to-reveal"
import type { CashPrize } from "@/types/types"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Clock } from "lucide-react"


export default function CashprizeView() {
  const [prize, setPrize] = useState<Omit<CashPrize, "created_at" | "updated_at" | "is_active" | "probability"> | null>(
    null,
  )
  const [loading, setLoading] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [isPageLoaded, setIsPageLoaded] = useState(false)

  useEffect(() => {
    const storedCountdownData = localStorage.getItem('prizeCountdown')
    if (storedCountdownData) {
      const { endTime } = JSON.parse(storedCountdownData)
      const now = Date.now()
      const remainingTime = Math.max(0, Math.floor((endTime - now) / 1000))
      
      if (remainingTime > 0) {
        setCountdown(remainingTime)
      } else {
        localStorage.removeItem('prizeCountdown')
        setCountdown(0)
      }
    }
  }, [])

  const generatePrize = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/cashprize")

      if (!res.ok) {
        throw new Error("Failed to fetch prize")
      }

      const data = await res.json()
      const { success, prize, timeRemaining } = data
      console.log({ success, prize, timeRemaining })
      setPrize(prize)

      if (timeRemaining) {        
        const seconds = timeToSeconds(timeRemaining)
        setCountdown(seconds)
        
        // Store countdown end time in localStorage
        const endTime = Date.now() + (seconds * 1000)
        localStorage.setItem('prizeCountdown', JSON.stringify({
          endTime,
          originalDuration: seconds
        }))
      }
    } catch (error) {
      console.error("Error generating prize:", error)
    } finally {
      setLoading(false)
    }
  }

  // Modified countdown timer effect
  useEffect(() => {
    if (!isPageLoaded) {
      setIsPageLoaded(true)
      return
    }
    if (countdown === null || countdown <= 0) {
      if (countdown === 0) {
        localStorage.removeItem('prizeCountdown')
      }
      return
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer)
          localStorage.removeItem('prizeCountdown')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [countdown])

  const timeToSeconds = (timeStr: string) => {
    const regex = /(\d+)\s*min\s*(\d+)\s*sec/;
    const match = timeStr.match(regex);

    if (match) {
        const minutes = parseInt(match[1], 10);
        const seconds = parseInt(match[2], 10);
        return minutes * 60 + seconds;
    }
    return 0;  
}

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    return [
      hours.toString().padStart(2, "0"),
      minutes.toString().padStart(2, "0"),
      secs.toString().padStart(2, "0"),
    ].join(":")
  }

  const handleScratchComplete = () => {
    setRevealed(true)
  }



  return (
    
    <div className="flex flex-col items-center gap-6 p-4 mt-11 ">
      {countdown !== null && countdown > 0 && (
        <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-lg border border-amber-200">
          <Clock className="h-5 w-5" />
          <span>Next prize available in: {formatTime(countdown)}</span>
        </div>
      )}

      {!prize && !countdown && isPageLoaded && (
        <Button
          onClick={generatePrize}
          disabled={loading || (countdown !== null && countdown > 0)}
          size="lg"
          className="text-lg"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Prize...
            </>
          ) : countdown !== null && countdown > 0 ? (
            "Wait for next prize"
          ) : (
            "Click to Generate Prize"
          )}
        </Button>
      )}

      {prize && (
        <div className="w-full max-w-md">
          <ScratchToReveal
            width={450}
            height={450}
            minScratchPercentage={30}
            onComplete={handleScratchComplete}
            className="flex items-center justify-center overflow-hidden rounded-2xl border-2 bg-gray-100"
            gradientColors={["#A97CF8", "#F38CB8", "#FDCC92"]}
          >
            <div className="flex flex-col items-center justify-center text-center p-4">
              <h2 className="text-3xl font-bold mb-2">Congratulations!</h2>
              <p className="text-xl mb-4">You've won:</p>
              <div className="text-5xl font-bold text-primary mb-2">${prize.prize_amount.toFixed(2)}</div>
              <p className="text-lg">{prize.prize_name || "Cash Prize"}</p>
              {revealed && (
                <Button
                  className="mt-6 cursor-pointer"
                  variant="outline"
                  onClick={() => {
                    setPrize(null)
                    setRevealed(false)
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
  )
}

