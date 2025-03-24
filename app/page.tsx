import { HoopBuddyForm } from "@/components/hoopbuddy-form"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-500/20 via-background to-black/10 dark:from-orange-950/30 dark:via-background dark:to-black/50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-end mb-4">
          <ThemeToggle />
        </div>
        <HoopBuddyForm />
      </div>
    </main>
  )
}

