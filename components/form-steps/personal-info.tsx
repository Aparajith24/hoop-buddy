"use client"

import { motion } from "framer-motion"
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface PersonalInfoStepProps {
  name: string
  onNameChange: (name: string) => void
}

export function PersonalInfoStep({ name, onNameChange }: PersonalInfoStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
          Welcome to HoopBuddy
        </CardTitle>
        <CardDescription className="text-lg">Your personal basketball workout assistant</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">What's your name? 👋</Label>
          <Input
            id="name"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            className="bg-white/70 dark:bg-black/30 backdrop-blur-sm border-orange-200 dark:border-orange-900/50"
          />
        </div>
      </CardContent>
    </motion.div>
  )
} 