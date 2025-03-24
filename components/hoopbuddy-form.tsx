"use client"

import React, { useState, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardFooter } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { FormData, WorkoutPlanType } from "./types"
import {
  PersonalInfoStep,
  AgeStep,
  PositionStep,
  ScheduleStep,
  LevelStep,
  ImprovementStep,
  ResultStep,
  LoadingStep
} from "./form-steps"

export function HoopBuddyForm() {
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    age: "",
    position: "",
    schedule: {
      monday: { selected: false, hours: 1, timeOfDay: [] },
      tuesday: { selected: false, hours: 1, timeOfDay: [] },
      wednesday: { selected: false, hours: 1, timeOfDay: [] },
      thursday: { selected: false, hours: 1, timeOfDay: [] },
      friday: { selected: false, hours: 1, timeOfDay: [] },
      saturday: { selected: false, hours: 1, timeOfDay: [] },
      sunday: { selected: false, hours: 1, timeOfDay: [] },
    },
    level: "",
    improvement: "",
  })
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlanType | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loadingMessage, setLoadingMessage] = useState<string>("")
  const workoutPlanRef = useRef<HTMLDivElement>(null)

  const loadingMessages = [
    "Analyzing your basketball superpower...",
    "Optimizing dribble sequences...",
    "Calculating your shooting arc...",
    "Designing your path to the NBA...",
    "Mixing the secret sauce ingredients...",
    "Channeling the spirit of Lebron James...",
    "Consulting with Coach AI...",
    "Crafting your basketball destiny...",
    "Perfecting your slam dunk potential...",
    "Building your championship mindset..."
  ]

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleScheduleChange = (day: string, field: string, value: boolean | number | string[]) => {
    setFormData((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: {
          ...prev.schedule[day],
          [field]: value,
        },
      },
    }))
  }

  const handleTimeOfDayChange = (day: string, timeOfDay: string) => {
    const currentTimeOfDay = formData.schedule[day].timeOfDay
    const updatedTimeOfDay = currentTimeOfDay.includes(timeOfDay)
      ? currentTimeOfDay.filter((time) => time !== timeOfDay)
      : [...currentTimeOfDay, timeOfDay]

    handleScheduleChange(day, "timeOfDay", updatedTimeOfDay)
  }

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1)
    } else {
      generateWorkoutPlan()
    }
  }

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }


  const generateWorkoutPlan = async () => {
    setIsLoading(true)
    setError(null)
    let messageIndex = 0;
    const messageInterval = setInterval(() => {
      setLoadingMessage(loadingMessages[messageIndex % loadingMessages.length])
      messageIndex++;
    }, 3000);
    
    try {
      const selectedDays = Object.entries(formData.schedule)
        .filter(([_, value]) => value.selected)
        .map(([day, value]) => ({
          day,
          hours: value.hours,
          timeOfDay: value.timeOfDay
        }))
        
      const payload = {
        name: formData.name,
        age: formData.age,
        position: formData.position,
        level: formData.level,
        improvement: formData.improvement,
        availableDays: selectedDays
      }
      setLoadingMessage(loadingMessages[0])
      
      // Use the new Express backend API endpoint
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5050'
      const response = await fetch(`${BACKEND_URL}/api/generate-workout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.error || errorData?.details || 
          `Failed to generate workout plan: ${response.status} ${response.statusText}`
        );
      }
      
      const data = await response.json()
      setWorkoutPlan(data)
      setStep(6)
    } catch (err) {
      console.error('Error generating workout plan:', err)
      setError(err instanceof Error ? err.message : 'Failed to generate workout plan')
    } finally {
      clearInterval(messageInterval)
      setIsLoading(false)
    }
  }

  const renderStepContent = () => {
    if (isLoading) {
      return (
        <LoadingStep 
          loadingMessage={loadingMessage} 
          position={formData.position}
          level={formData.level} 
        />
      )
    }
    
    switch (step) {
      case 0:
        return (
          <PersonalInfoStep 
            name={formData.name} 
            onNameChange={(value) => handleInputChange("name", value)} 
          />
        )
      case 1:
        return (
          <AgeStep 
            age={formData.age} 
            onAgeChange={(value) => handleInputChange("age", value)} 
          />
        )
      case 2:
        return (
          <PositionStep 
            position={formData.position} 
            onPositionChange={(value) => handleInputChange("position", value)} 
          />
        )
      case 3:
        return (
          <ScheduleStep 
            schedule={formData.schedule} 
            onScheduleChange={handleScheduleChange} 
            onTimeOfDayChange={handleTimeOfDayChange} 
          />
        )
      case 4:
        return (
          <LevelStep 
            level={formData.level} 
            onLevelChange={(value) => handleInputChange("level", value)} 
          />
        )
      case 5:
        return (
          <ImprovementStep 
            improvement={formData.improvement} 
            onImprovementChange={(value) => handleInputChange("improvement", value)} 
          />
        )
      case 6:
        return workoutPlan && (
          <ResultStep 
            workoutPlan={workoutPlan} 
            workoutPlanRef={workoutPlanRef as React.RefObject<HTMLDivElement>} 
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="border-orange-100 dark:border-orange-900/50 shadow-xl bg-white/40 dark:bg-gradient-to-br dark:from-orange-950/40 dark:via-gray-900/60 dark:to-black/60 backdrop-blur-md">
        <AnimatePresence mode="wait">{renderStepContent()}</AnimatePresence>
        <CardFooter className="flex justify-between pt-6">
          {step > 0 && step < 6 && !isLoading && (
            <Button variant="outline" onClick={handleBack} className="gap-1">
              <ChevronLeft className="h-4 w-4" /> Back
            </Button>
          )}
          {step === 0 && <div></div>}
          {step < 6 && !isLoading && (
            <Button 
              onClick={handleNext} 
              className="bg-orange-500 hover:bg-orange-600 gap-1 ml-auto"
            >
              {step === 5 ? "Generate Plan" : "Next"} <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </CardFooter>
        
        {error && (
          <div className="px-6 pb-4 text-red-500 text-sm">
            Error: {error}
          </div>
        )}
      </Card>

      {step < 6 && !isLoading && (
        <div className="flex justify-center mt-6 gap-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              className={`h-2 rounded-full ${
                i === step ? "w-8 bg-orange-500" : "w-2 bg-orange-200 dark:bg-orange-800/30"
              }`}
              initial={{ opacity: 0.6 }}
              animate={{ opacity: i === step ? 1 : 0.6 }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

