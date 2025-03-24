"use client"

import { motion } from "framer-motion"
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { positions } from "@/lib/constants"

interface PositionStepProps {
  position: string
  onPositionChange: (position: string) => void
}

export function PositionStep({ position, onPositionChange }: PositionStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <CardHeader>
        <CardTitle>What position do you play? 🏆</CardTitle>
        <CardDescription>Select your primary position on the court</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={position}
          onValueChange={onPositionChange}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {positions.map((position) => (
            <div key={position.value} className="flex items-center space-x-2">
              <RadioGroupItem value={position.value} id={position.value} className="peer sr-only" />
              <Label
                htmlFor={position.value}
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white/70 backdrop-blur-sm p-4 hover:bg-orange-50 hover:border-orange-200 peer-data-[state=checked]:border-orange-500 peer-data-[state=checked]:bg-orange-50 w-full cursor-pointer"
              >
                <div className="mb-3 rounded-full p-2 flex items-center justify-center">
                  <img
                    src={`/${position.value === "pointGuard" ? "pg" : 
                           position.value === "shootingGuard" ? "sg" : 
                           position.value === "smallForward" ? "sf" : 
                           position.value === "powerForward" ? "pf" : 
                           position.value === "center" ? "c" : ""}.png`}
                    alt={position.label}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                </div>
                <div className="font-medium text-black">{position.label}</div>
                <div className="text-xs text-black">{position.description}</div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </motion.div>
  )
} 