export interface FormSchedule {
  [key: string]: {
    selected: boolean
    hours: number
    timeOfDay: string[]
  }
}

export interface FormData {
  name: string
  age: string
  position: string
  schedule: FormSchedule
  level: string
  improvement: string
}

export interface Exercise {
  name: string
  duration: string
  description: string
}

export interface DaySchedule {
  day: string
  hours: number
  timeOfDay: string[]
  exercises: Exercise[]
}

export interface WorkoutPlanType {
  name: string
  age: string | number
  position: string
  level: string
  focusAreas: string
  workoutSchedule: DaySchedule[]
} 