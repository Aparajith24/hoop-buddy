"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { ChevronLeft, ChevronRight, Download, Trophy, Loader2 } from "lucide-react"
import { WorkoutPlan } from "@/components/workout-plan"
import { positions, days, levels } from "@/lib/constants"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

interface FormSchedule {
  [key: string]: {
    selected: boolean
    hours: number
    timeOfDay: string[]
  }
}

interface FormData {
  name: string
  age: string
  position: string
  schedule: FormSchedule
  level: string
  improvement: string
}

interface Exercise {
  name: string
  duration: string
  description: string
}

interface DaySchedule {
  day: string
  hours: number
  timeOfDay: string[]
  exercises: Exercise[]
}

interface WorkoutPlanType {
  name: string
  age: string | number
  position: string
  level: string
  focusAreas: string
  workoutSchedule: DaySchedule[]
}

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
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)


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

  const generatePDF = async () => {
    if (!workoutPlanRef.current || !workoutPlan) return
    
    try {
      setIsGeneratingPDF(true)
      // Set a loading state if needed
      const element = workoutPlanRef.current
      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true
      })
      
      const imgData = canvas.toDataURL('image/png')
      
      // Initialize PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })
      
      const imgWidth = 210 // A4 width in mm
      const pageHeight = 297 // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      
      let heightLeft = imgHeight
      let position = 0
      
      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
      
      // Add subsequent pages if needed
      while (heightLeft > 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }
      
      // Create a filename with the person's name
      const fileName = `${workoutPlan.name.replace(/\s+/g, '_')}_basketball_workout_plan.pdf`
      pdf.save(fileName)
      
    } catch (err) {
      console.error('Error generating PDF:', err)
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const generateWorkoutPlan = async () => {
    setIsLoading(true)
    setError(null)
    
    // Start cycling through loading messages
    let messageIndex = 0;
    const messageInterval = setInterval(() => {
      setLoadingMessage(loadingMessages[messageIndex % loadingMessages.length])
      messageIndex++;
    }, 3000);
    
    try {
      // Prepare data for Gemini API
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
      
      // Set initial loading message
      setLoadingMessage(loadingMessages[0])
      
      // Make API call to your backend that will call Gemini API
      const response = await fetch('/api/generate-workout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
      
      if (!response.ok) {
        throw new Error('Failed to generate workout plan')
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

  // Loading screen case
  const renderLoadingScreen = () => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="py-12 px-4"
      >
        <div className="text-center space-y-8">          
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-700 dark:from-orange-400 dark:to-orange-600 bg-clip-text text-transparent">
            Creating Your Custom Workout Plan
          </CardTitle>
          
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-orange-200 dark:border-orange-900/30"></div>
              <div className="absolute inset-0 rounded-full border-4 border-t-orange-500 animate-spin"></div>
            </div>
            <motion.p 
              className="text-lg font-medium text-orange-500"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              key={loadingMessage} // This forces re-animation when message changes
            >
              {loadingMessage}
            </motion.p>
          </div>
          
          <div className="mt-8 max-w-md mx-auto bg-orange-50/80 dark:bg-orange-950/20 p-4 rounded-lg border border-orange-200 dark:border-orange-900/30">
            <p className="text-muted-foreground">
              Our AI coach is analyzing your profile and designing personalized exercises 
              tailored to your position as a <span className="text-orange-600 dark:text-orange-400 font-medium">{formData.position || "player"}</span>, 
              at <span className="text-orange-600 dark:text-orange-400 font-medium">{formData.level || "your"}</span> level,
              focusing on the areas you want to improve.
            </p>
          </div>
          
          <div className="flex items-center justify-center gap-1 animate-pulse-orange">
            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
          </div>
        </div>
      </motion.div>
    )
  }

  const renderStepContent = () => {
    if (isLoading) {
      return renderLoadingScreen()
    }
    
    switch (step) {
      case 0:
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
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="bg-white/70 dark:bg-black/30 backdrop-blur-sm border-orange-200 dark:border-orange-900/50"
                />
              </div>
            </CardContent>
          </motion.div>
        )
      case 1:
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
                  value={formData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  className="bg-white/70 dark:bg-black/30 backdrop-blur-sm border-orange-200 dark:border-orange-900/50"
                />
              </div>
            </CardContent>
          </motion.div>
        )
      case 2:
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
                value={formData.position}
                onValueChange={(value) => handleInputChange("position", value)}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {positions.map((position) => (
                  <div key={position.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={position.value} id={position.value} className="peer sr-only" />
                    <Label
                      htmlFor={position.value}
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white/70 backdrop-blur-sm p-4 hover:bg-orange-50 hover:border-orange-200 peer-data-[state=checked]:border-orange-500 peer-data-[state=checked]:bg-orange-50 w-full cursor-pointer"
                    >
                      <div className="mb-3 rounded-full  p-2 flex items-center justify-center">
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
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <CardHeader>
              <CardTitle>When can you workout? 📅</CardTitle>
              <CardDescription>Select days, hours, and preferred time of day</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {days.map((day) => (
                <div key={day.value} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={day.value}
                      checked={formData.schedule[day.value].selected}
                      onCheckedChange={(checked) => 
                        handleScheduleChange(day.value, "selected", checked === true)
                      }
                    />
                    <Label htmlFor={day.value} className="font-medium">
                      {day.label}
                    </Label>
                  </div>

                  {formData.schedule[day.value].selected && (
                    <div className="ml-6 space-y-4 mt-2 p-3 bg-white/50 backdrop-blur-sm rounded-md">
                      <div className="space-y-2">
                        <Label>Hours available: {formData.schedule[day.value].hours}</Label>
                        <Slider
                          value={[formData.schedule[day.value].hours]}
                          min={1}
                          max={4}
                          step={0.5}
                          onValueChange={(value) => handleScheduleChange(day.value, "hours", value[0])}
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Time of day</Label>
                        <div className="flex flex-wrap gap-2">
                          {["Morning", "Afternoon", "Evening"].map((time) => (
                            <Button
                              key={time}
                              type="button"
                              variant={formData.schedule[day.value].timeOfDay.includes(time) ? "default" : "outline"}
                              onClick={() => handleTimeOfDayChange(day.value, time)}
                              className={
                                formData.schedule[day.value].timeOfDay.includes(time)
                                  ? "bg-orange-500 hover:bg-orange-600"
                                  : ""
                              }
                              size="sm"
                            >
                              {time} {time === "Morning" ? "🌅" : time === "Afternoon" ? "☀️" : "🌙"}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </motion.div>
        )
      case 4:
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
              <Select value={formData.level} onValueChange={(value) => handleInputChange("level", value)}>
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
      case 5:
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
                value={formData.improvement}
                onChange={(e) => handleInputChange("improvement", e.target.value)}
                className="min-h-[150px] bg-white/70 dark:bg-black/30 backdrop-blur-sm border-orange-200 dark:border-orange-900/50"
              />
            </CardContent>
          </motion.div>
        )
      case 6:
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
                {workoutPlan && <WorkoutPlan plan={workoutPlan} />}
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button 
                className="bg-orange-500 hover:bg-orange-600"
                onClick={generatePDF}
                disabled={isGeneratingPDF}
              >
                {isGeneratingPDF ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating PDF...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" /> Download PDF
                  </>
                )}
              </Button>
            </CardFooter>
          </motion.div>
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

