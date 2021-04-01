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
          <meta name="application-name" content="u-znth" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <meta name="apple-mobile-web-app-title" content="u-znth" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="msapplication-TileColor" content="#f29f05" />
          <meta name="msapplication-tap-highlight" content="no" />
          <meta property="og:site_name" content="u-znth" />
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
