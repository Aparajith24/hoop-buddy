"use client"

import { motion } from "framer-motion"
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { days } from "@/lib/constants"

interface FormSchedule {
  [key: string]: {
    selected: boolean
    hours: number
    timeOfDay: string[]
  }
}

interface ScheduleStepProps {
  schedule: FormSchedule
  onScheduleChange: (day: string, field: string, value: boolean | number | string[]) => void
  onTimeOfDayChange: (day: string, timeOfDay: string) => void
}

export function ScheduleStep({ schedule, onScheduleChange, onTimeOfDayChange }: ScheduleStepProps) {
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
                checked={schedule[day.value].selected}
                onCheckedChange={(checked) => 
                  onScheduleChange(day.value, "selected", checked === true)
                }
              />
              <Label htmlFor={day.value} className="font-medium">
                {day.label}
              </Label>
            </div>

            {schedule[day.value].selected && (
              <div className="ml-6 space-y-4 mt-2 p-3 bg-white/50 backdrop-blur-sm rounded-md">
                <div className="space-y-2">
                  <Label>Hours available: {schedule[day.value].hours}</Label>
                  <Slider
                    value={[schedule[day.value].hours]}
                    min={1}
                    max={4}
                    step={0.5}
                    onValueChange={(value) => onScheduleChange(day.value, "hours", value[0])}
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
                        variant={schedule[day.value].timeOfDay.includes(time) ? "default" : "outline"}
                        onClick={() => onTimeOfDayChange(day.value, time)}
                        className={
                          schedule[day.value].timeOfDay.includes(time)
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
} 