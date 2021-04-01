import Document, {
  DocumentContext,
  Html,
  Head,
  Main,
  NextScript,
} from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <meta
            name="description"
            content="u-znth is a low-latency synthesizer comprised of four oscillators, created by Ulises Himely using React, the Web Audio api, an Audio Worklet, and a Web Worker."
          />
          <meta property="og:title" content="u-znth by Ulises Himely" />
          <meta
            property="og:image"
            content="https://res.cloudinary.com/da3fgujdy/image/upload/c_fill,g_north_west,h_630,q_100,w_1200/v1617312468/u-znth/screenshot_kqmfjz.png"
          />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:url" content="https://uznth.live" />
          <meta property="og:type" content="website" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@uliseshimely" />
          <meta name="twitter:title" content="u-znth by Ulises Himely" />
          <meta
            name="twitter:description"
            content="u-znth is a low-latency synthesizer comprised of four oscillators, created by Ulises Himely using React, the Web Audio api, an Audio Worklet, and a Web Worker."
          />
          <meta
            name="twitter:image"
            content="https://res.cloudinary.com/da3fgujdy/image/upload/c_fill,g_north_west,h_630,q_100,w_1200/v1617312468/u-znth/screenshot_kqmfjz.png"
          />
          <meta name="twitter:image:alt" content="Screenshot of u-znth.live" />
          <link
            rel="shortcut icon"
            href="/images/logo/icon@192x.png"
            type="image/x-icon"
          />
          <link rel="alternate icon" href="/images/logo/favicon.png" />
          <link rel="apple-touch-icon" href="/images/logo/icon@192x.png" />
          <link rel="manifest" href="/manifest.json" />
          <link
            rel="mask-icon"
            href="/images/logo/mask-icon.svg"
            color="#fff8e2"
          />
          <meta name="theme-color" content="#f29f05" />
          <meta
            name="keywords"
            content="portfolio, javascript, react, developer, typescript"
          />
          <meta name="application-name" content="u-znth by Ulises Himely" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <meta
            name="apple-mobile-web-app-title"
            content="u-znth by Ulises Himely"
          />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="msapplication-TileColor" content="#f29f05" />
          <meta name="msapplication-tap-highlight" content="no" />
          <meta property="og:site_name" content="uznth.live" />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'Person',
                url: 'https://www.uznth.live',
                image: 'https://www.uznth.live/images/logo/icon@192x.png',
              }),
            }}
          />
        </Head>
        <body className="theme-default">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
