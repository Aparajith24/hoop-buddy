"use client"

import { motion } from "framer-motion"
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { levels } from "@/lib/constants"

interface LevelStepProps {
  level: string
  onLevelChange: (level: string) => void
}

export function LevelStep({ level, onLevelChange }: LevelStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <CardHeader>
        <CardTitle>What level do you play at? 🏅</CardTitle>
        <CardDescription>This helps us determine the intensity of your workouts</CardDescription>
      </CardHeader>
      <CardContent>
        <Select value={level} onValueChange={onLevelChange}>
          <SelectTrigger className="bg-white/70 dark:bg-black/30 backdrop-blur-sm border-orange-200 dark:border-orange-900/50">
            <SelectValue placeholder="Select your level" />
          </SelectTrigger>
          <SelectContent>
            {levels.map((level) => (
              <SelectItem key={level.value} value={level.value}>
                {level.label} {level.emoji}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </motion.div>
  )
} 