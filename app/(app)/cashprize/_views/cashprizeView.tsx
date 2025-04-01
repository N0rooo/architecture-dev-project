"use client"
import { ScratchToReveal } from "@/components/magicui/scratch-to-reveal"
import type { CashPrize } from "@/types/types"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export default function CashprizeView() {
  const [prize, setPrize] = useState<Omit<CashPrize, "created_at" | "updated_at" | "is_active" | "probability"> | null>(
    null
  )
  const [loading, setLoading] = useState(false)
  const [revealed, setRevealed] = useState(false)

  const generatePrize = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/cashprize")

      if (!res.ok) {
        throw new Error("Failed to fetch prize")
      }

      const data = await res.json()
      setPrize(data)
    } catch (error) {
      console.error("Error generating prize:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleScratchComplete = () => {
    setRevealed(true)
  }

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      {!prize && (
        <Button onClick={generatePrize} disabled={loading} size="lg" className="text-lg">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Prize...
            </>
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

