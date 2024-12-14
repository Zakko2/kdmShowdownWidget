// components/ui/card.jsx
import { cn } from "@/lib/utils"

const Card = ({ className, ...props }) => (
  <div className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)} {...props} />
)

const CardHeader = ({ className, ...props }) => (
  <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
)

const CardTitle = ({ className, ...props }) => (
  <h3 className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
)

const CardContent = ({ className, ...props }) => (
  <div className={cn("p-6 pt-0", className)} {...props} />
)

export { Card, CardHeader, CardTitle, CardContent }

// app/layout.jsx
import './globals.css'

export const metadata = {
  title: 'Hit Calculator',
  description: 'Calculate hit chances for your attacks',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background">
        <main className="container mx-auto p-4">
          {children}
        </main>
      </body>
    </html>
  )
}

// app/globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;

// app/page.jsx
import HitCalculator from '@/components/HitCalculator'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <HitCalculator />
    </div>
  )
}
