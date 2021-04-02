import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
const Layout = dynamic(() => import('components/Layout'))

import 'styles/global.scss'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}
