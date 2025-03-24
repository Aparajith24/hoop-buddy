# HoopBuddy 🏀

HoopBuddy is a personalized basketball workout assistant that generates custom training plans based on your position, skill level, and availability.

## Features

- Personalized workout plans tailored to your position, level, and training goals
- AI-powered exercise recommendations using Google's Gemini API
- Interactive UI with multi-step form and animated transitions
- Responsive design that works on desktop and mobile

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- NPM or Yarn
- A Gemini API key from [Google AI Studio](https://aistudio.google.com/)

### Installation

1. Clone the repository
```bash
git clone https://github.com/Aparajith24/hoop-buddy.git
cd hoopbuddy
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables  
Create or modify the `.env.local` file in the root directory:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

### Running the Application

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## How It Works

1. Users fill out a multi-step form with their:
   - Name and age
   - Playing position
   - Weekly availability 
   - Skill level
   - Areas they want to improve

2. The form data is sent to our backend API endpoint
   
3. The backend communicates with the Gemini API to generate a personalized workout plan

4. The workout plan is displayed to the user with a day-by-day breakdown of exercises

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- Gemini API (Google Generative AI)

## License

MIT 