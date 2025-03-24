"use client"

import { motion } from "framer-motion"
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface AgeStepProps {
  age: string
  onAgeChange: (age: string) => void
}

export function AgeStep({ age, onAgeChange }: AgeStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <CardHeader>
        <CardTitle>How old are you? 🎂</CardTitle>
        <CardDescription>This helps us tailor your workout plan</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            type="number"
            placeholder="Enter your age"
            value={age}
            onChange={(e) => onAgeChange(e.target.value)}
            className="bg-white/70 dark:bg-black/30 backdrop-blur-sm border-orange-200 dark:border-orange-900/50"
          />
        </div>
      </CardContent>
    </motion.div>
  )
} 