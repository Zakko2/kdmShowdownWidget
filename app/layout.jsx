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
