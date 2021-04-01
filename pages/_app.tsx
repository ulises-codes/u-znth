import Layout from 'components/Layout'
import type { AppProps } from 'next/app'
import 'styles/global.scss'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}
