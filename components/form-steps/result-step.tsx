"use client"

import { motion } from "framer-motion"
import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Trophy, Loader2 } from "lucide-react"
import { WorkoutPlan } from "@/components/workout-plan"
import { RefObject } from "react"

interface WorkoutPlanType {
  name: string
  age: string | number
  position: string
  level: string
  focusAreas: string
  workoutSchedule: Array<{
    day: string
    hours: number
    timeOfDay: string[]
    exercises: Array<{
      name: string
      duration: string
      description: string
    }>
  }>
}

interface ResultStepProps {
  workoutPlan: WorkoutPlanType
  workoutPlanRef: RefObject<HTMLDivElement | null>
}

export function ResultStep({ 
  workoutPlan, 
  workoutPlanRef, 
}: ResultStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <CardHeader className="text-center">
        <div className="mx-auto bg-gradient-to-br from-orange-500 to-orange-600 w-16 h-16 rounded-full flex items-center justify-center mb-4">
          <Trophy className="h-8 w-8 text-white" />
        </div>
        <CardTitle className="text-2xl">Your Personalized Workout Plan</CardTitle>
        <CardDescription>
          Based on your profile, we've created a custom basketball training program
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div ref={workoutPlanRef}>
          <WorkoutPlan plan={workoutPlan} />
        </div>
      </CardContent>
      <CardFooter className="flex justify-center space-x-2">
        <Button className="bg-orange-500 hover:bg-orange-600" onClick={() => window.location.reload()}>
          Restart Form
        </Button>
      </CardFooter>
    </motion.div>
  )
} 