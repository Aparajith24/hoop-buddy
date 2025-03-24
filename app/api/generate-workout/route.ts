import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Define the interface for available days
interface AvailableDay {
  day: string;
  hours: number;
  timeOfDay: string[];
}

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, age, position, level, improvement, availableDays } = body;

    if (!name || !age || !position || !level || !improvement || !availableDays || availableDays.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      systemInstruction: `You are a professional basketball trainer specializing in creating personalized workout plans. 
      Create a detailed basketball workout plan based on the user's profile information.`
    });

    const prompt = `
      Create a detailed basketball workout plan for a player with the following profile:
      
      Name: ${name}
      Age: ${age}
      Position: ${position}
      Level: ${level}
      Areas for improvement: ${improvement}
      
      Available days for training:
      ${availableDays.map((day: AvailableDay) => `- ${day.day.charAt(0).toUpperCase() + day.day.slice(1)}: ${day.hours} hours, Time: ${day.timeOfDay.join(', ')}`).join('\n')}
      
      For each day, create specific exercises with durations and descriptions. Describe the exercises in detail, including the equipment needed, the specific movements, and the target muscle groups.
      Specify each workout sperately with amount of repetitions and sets.
      Return your response as a properly formatted JSON object with the following structure:
      {
        "name": "${name}",
        "age": "${age}",
        "position": "${position}",
        "level": "${level}",
        "focusAreas": "Brief summary of focus areas based on their improvement needs",
        "workoutSchedule": [
          {
            "day": "day name",
            "hours": number of hours,
            "timeOfDay": ["Morning", "Afternoon", "Evening"],
            "exercises": [
              {
                "name": "Exercise Name",
                "duration": "Duration in minutes",
                "description": "Detailed description of the exercise"
              }
              // more exercises...
            ]
          }
          // more days...
        ]
      }
      
      IMPORTANT: Ensure the response is a valid JSON object. Use standard JSON format without any markdown or code blocks.
      Make the exercises specific to basketball skills and appropriate for their position, level, and improvement areas.
    `;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || [null, text];
      const jsonText = jsonMatch[1];
      
      const jsonResponse = JSON.parse(jsonText);
      
      return NextResponse.json(jsonResponse);
    } catch (parseError) {
      console.error('Error parsing Gemini response as JSON:', parseError);
      console.log('Raw response:', text);
      
      return NextResponse.json(
        { error: 'Failed to generate a valid workout plan', details: 'The AI generated an invalid response format' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in generate-workout API:', error);
    
    return NextResponse.json(
      { error: 'Failed to generate workout plan', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 