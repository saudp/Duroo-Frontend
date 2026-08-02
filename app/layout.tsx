import type { Metadata } from 'next'
import './globals.css'
import {
  instrumentSans,
  instrumentSerif,
  afacad,
  jetbrains,
  geist,
  geistMono,
} from './fonts'
import Announce from '@/components/home/Announce'
import Nav from '@/components/home/Nav'
import Footer from '@/components/home/Footer'

export const metadata: Metadata = {
  title: 'Duroo · Performance Lifestyle',
  description:
    'Duroo is built for those moving through their days with intent — the long flight, the run before work, the dinner that runs late. We make clothes that move with all of it.',
  openGraph: {
    title: 'Duroo · Performance Lifestyle',
    description: 'Performance fabrics, drawn in the language of restraint.',
    siteName: 'Duroo',
  },
}

const fontVars = [
  instrumentSans.variable,
  instrumentSerif.variable,
  afacad.variable,
  jetbrains.variable,
  geist.variable,
  geistMono.variable,
].join(' ')

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light">
      <body className={fontVars} suppressHydrationWarning>
        <Announce />
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  )
}
