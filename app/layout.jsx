// app/layout.jsx
import './globals.css'

export const metadata = {
  title: 'KDM Hit Calculator',
  description: 'Calculate hit chances for your Kingdom Death: Monster attacks',
  manifest: '/manifest.json',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className="min-h-screen bg-background" suppressHydrationWarning>
        <main className="container mx-auto p-4">
          {children}
        </main>
      </body>
    </html>
  )
}
