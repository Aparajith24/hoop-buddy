"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Dumbbell, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Exercise {
  name: string;
  duration: string;
  description: string;
}

interface DaySchedule {
  day: string;
  hours: number;
  timeOfDay: string[];
  exercises: Exercise[];
}

interface WorkoutPlanType {
  name: string;
  age: string | number;
  position: string;
  level: string;
  focusAreas: string;
  workoutSchedule: DaySchedule[];
}

export function WorkoutPlan({ plan }: { plan: WorkoutPlanType }) {
  const [selectedDay, setSelectedDay] = useState(
    plan.workoutSchedule.length > 0 ? plan.workoutSchedule[0].day : ""
  );

  const getDaySchedule = () => {
    return (
      plan.workoutSchedule.find(
        (schedule: DaySchedule) => schedule.day === selectedDay
      ) || {}
    );
  };

  const daySchedule = getDaySchedule() as DaySchedule;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-100 to-white dark:from-orange-950/40 dark:to-black/40 p-4 rounded-lg">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-orange-500" />
            <div>
              <span className="text-sm text-muted-foreground">Name:</span>
              <span className="ml-1 font-medium">{plan.name}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-500" />
            <div>
              <span className="text-sm text-muted-foreground">Age:</span>
              <span className="ml-1 font-medium">{plan.age}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="bg-orange-50 text-orange-700 border-orange-200"
            >
              {plan.position === "pointGuard" ? "Point Guard"
                  : plan.position === "shootingGuard" ? "Shooting Guard"
                  : plan.position === "smallForward" ? "Small Forward"
                  : plan.position === "powerForward" ? "Power Forward"
                  : "Center"}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="bg-black text-white border-black"
            >
              {plan.level == "recreational" ? "Recreational"
                : plan.level == "school" ? "School"
                : plan.level == "highSchool" ? "High School"
                : plan.level == "college" ? "College"
                : plan.level == "semiPro" ? "Semi-Pro"
                : "Professional"}
            </Badge>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-medium">Focus Areas:</h3>
        <p className="text-muted-foreground bg-white/70 dark:bg-black/30 backdrop-blur-sm p-3 rounded-md border border-orange-100 dark:border-orange-900/50">
          {plan.focusAreas}
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Weekly Schedule:</h3>
        <Tabs
          value={selectedDay}
          onValueChange={setSelectedDay}
          className="w-full"
        >
          <TabsList className="w-full justify-start overflow-auto py-2 h-auto flex-wrap">
            {plan.workoutSchedule.map((schedule: DaySchedule) => (
              <TabsTrigger
                key={schedule.day}
                value={schedule.day}
                className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
              >
                {schedule.day.charAt(0).toUpperCase() + schedule.day.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedDay} className="mt-4">
            {daySchedule.exercises ? (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className="bg-orange-100 dark:bg-orange-900/70 text-orange-800 dark:text-orange-200 hover:bg-orange-200 dark:hover:bg-orange-800">
                    {daySchedule.hours} hours
                  </Badge>
                  {daySchedule.timeOfDay?.map((time: string) => (
                    <Badge
                      key={time}
                      variant="outline"
                      className="bg-white dark:bg-black/20"
                    >
                      {time}{" "}
                      {time === "Morning"
                        ? "🌅"
                        : time === "Afternoon"
                          ? "☀️"
                          : "🌙"}
                    </Badge>
                  ))}
                </div>

                <div className="grid gap-4">
                  {daySchedule.exercises.map(
                    (exercise: Exercise, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="overflow-hidden border-orange-100 dark:border-orange-900/50">
                          <div className="h-2 bg-gradient-to-r from-orange-400 to-orange-600" />
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                              <CardTitle className="text-lg flex items-center gap-2">
                                <Dumbbell className="h-5 w-5 text-orange-500" />
                                {exercise.name}
                              </CardTitle>
                              <Badge
                                variant="outline"
                                className="bg-black dark:bg-white text-white dark:text-black"
                              >
                                {exercise.duration}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-muted-foreground">
                              {exercise.description}
                            </p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center p-8 text-muted-foreground">
                No exercises scheduled for this day.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <div className="p-4 bg-black/5 dark:bg-white/5 rounded-lg mt-6">
        <div className="flex items-start gap-2">
          <Calendar className="h-5 w-5 text-orange-500 mt-0.5" />
          <div>
            <h3 className="font-medium">Workout Summary</h3>
            <p className="text-sm text-muted-foreground">
              Your plan includes workouts on {plan.workoutSchedule.length} days
              per week, focusing on improving your skills as a {plan.position}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
