"use client"

import { motion } from "framer-motion"
import { CardTitle } from "@/components/ui/card"

interface LoadingStepProps {
  loadingMessage: string
  position: string
  level: string
}

export function LoadingStep({ loadingMessage, position, level }: LoadingStepProps) {
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
            tailored to your position as a <span className="text-orange-600 dark:text-orange-400 font-medium">{position || "player"}</span>, 
            at <span className="text-orange-600 dark:text-orange-400 font-medium">{level || "your"}</span> level,
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