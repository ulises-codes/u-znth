import Head from 'next/head'
import { ReactNode } from 'react'
import Footer from './Footer'

type LayoutProps = {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Head key="meta-tags">
        <title>u-znth.io</title>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="initial-scale=1.0, width=device-width, shrink-to-fit=no"
        />
        <link
          rel="preload"
          as="style"
          type="text/css"
          crossOrigin="anonymous"
          onLoad={"this.rel='stylesheet';this.onload=null" as any}
          href="https://fonts.googleapis.com/css2?family=VT323&display=swap&text=AlowDenyPaszgrthipcuMI.O,mk-Z3012456789vbd%f"
        />
      </Head>
      <div>{children}</div>
      <Footer />
    </>
  )
}
