import type { Metadata } from 'next'
import Script from 'next/script'
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

// Unset in an environment with no credentials configured yet — each block
// below just doesn't render rather than erroring.
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID

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
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script
              id="ga-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_MEASUREMENT_ID}');
                `,
              }}
            />
          </>
        )}
        {META_PIXEL_ID && (
          <Script
            id="meta-pixel-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${META_PIXEL_ID}');
                fbq('track', 'PageView');
              `,
            }}
          />
        )}
        <Announce />
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  )
}
