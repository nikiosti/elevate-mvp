import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { MantineProvider } from '@mantine/core'

import { Provider } from '../providers/providers'
import { theme } from '@/theme'

import '@mantine/core/styles.css'
import './global.css'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang={process.env.LANG}>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Provider>
          <MantineProvider theme={theme}>{children}</MantineProvider>
        </Provider>
      </body>
    </html>
  )
}
