import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
// @ts-ignore - allow global CSS side-effect import in app layout
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Health Support AI - Your Friendly Health Assistant',
  description: 'AI-powered health support chatbot providing wellness guidance and health information',
  generator: 'v0.app',
  keywords: ['health', 'wellness', 'chatbot', 'AI assistant', 'health support'],
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const setInitialTheme = `try{(function(){const t=localStorage.getItem('theme');const prefersDark=window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches; if(t==='dark' || (!t && prefersDark)){document.documentElement.classList.add('dark');document.documentElement.style.colorScheme='dark';} else {document.documentElement.classList.remove('dark');document.documentElement.style.colorScheme='light';}})()}catch(e){}`

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: setInitialTheme }} />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider>
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
