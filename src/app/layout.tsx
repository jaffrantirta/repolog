import type { Metadata } from 'next'
import './globals.css'

const APP_URL = 'https://repolog.jaffran.my.id'

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'Repolog — GitHub Commits to Professional IT Reports',
    template: '%s | Repolog',
  },
  description:
    'Repolog converts your GitHub commit history into professional IT development reports in minutes. AI-powered, bilingual (Indonesian & English), PDF export. Built for developers and IT teams.',
  keywords: [
    'IT report generator',
    'GitHub commit report',
    'developer report automation',
    'laporan IT otomatis',
    'GitHub to PDF report',
    'AI IT report',
    'commit history report',
    'software development report',
  ],
  authors: [{ name: 'Repolog' }],
  creator: 'Repolog',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: APP_URL,
    siteName: 'Repolog',
    title: 'Repolog — GitHub Commits to Professional IT Reports',
    description:
      'Turn your GitHub commits into professional IT development reports in minutes. AI-powered classification, bilingual support, instant PDF export.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Repolog — IT Report Generator' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Repolog — GitHub Commits to Professional IT Reports',
    description:
      'Turn your GitHub commits into professional IT development reports in minutes.',
    images: ['/og.png'],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: APP_URL },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
