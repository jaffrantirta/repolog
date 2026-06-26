import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Repolog — IT Report Generator',
  description: 'Turn your GitHub commits into professional IT reports',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
