"use client"

import { motion } from "framer-motion"
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

interface ImprovementStepProps {
  improvement: string
  onImprovementChange: (improvement: string) => void
}

export function ImprovementStep({ improvement, onImprovementChange }: ImprovementStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <CardHeader>
        <CardTitle>What do you want to improve? 🚀</CardTitle>
        <CardDescription>Be honest about what you feel you lack in your game</CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="E.g., I need to improve my shooting form, ball handling, defensive footwork..."
          value={improvement}
          onChange={(e) => onImprovementChange(e.target.value)}
          className="min-h-[150px] bg-white/70 dark:bg-black/30 backdrop-blur-sm border-orange-200 dark:border-orange-900/50"
        />
      </CardContent>
    </motion.div>
  )
} 