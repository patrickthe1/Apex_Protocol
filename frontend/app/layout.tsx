import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '../contexts/AuthContext'
import { ThemeProvider } from '../components/theme-provider'

export const metadata: Metadata = {
  title: 'Apex Protocol',
  description: 'Private clubhouse for anonymous messaging',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
