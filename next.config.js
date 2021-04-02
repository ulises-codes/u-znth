const withPWA = require('next-pwa')

module.exports = withPWA({
  poweredByHeader: false,
  future: {
    webpack5: true,
  },
  webpack: (config, { isServer, dev }) => {
    //* Workaround for undefined Worker chunk error
    //* https://github.com/vercel/next.js/issues/22813
    config.output.chunkFilename = isServer
      ? `${dev ? '[name]' : '[name].[fullhash]'}.js`
      : `static/chunks/${dev ? '[name]' : '[name].[fullhash]'}.js`

    return config
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
        ],
      },
      {
        source: '/',
        headers: [
          { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
        ],
      },
    ]
  },
  pwa: {
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    mode: 'production',
  },
})
