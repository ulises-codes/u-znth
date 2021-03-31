const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.tsx',
  devtool:
    process.env.NODE_ENV === 'development' ? 'inline-source-map' : undefined,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /worklet\.ts$/,
        parser: {
          worker: ['Worklet from ./audio-worklet'],
        },
        type: 'asset/resource',
        generator: {
          filename: 'audio-worklet.js',
        },
      },
      {
        test: /\module.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.js', '.ts'],
  },
  devServer: {
    contentBase: './dist',
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'u-Znth Dev',
      inject: 'head',
      templateContent: ({ htmlWebpackPlugin }) => `
    <html>
    <head>
     <link
        rel="preload"
        as="style"
        type="text/css"
        crossOrigin="anonymous"
        onLoad="this.rel='stylesheet';this.onload=null"
        href="https://fonts.googleapis.com/css2?family=VT323&display=swap&text=u-Znth30oscilar12456789vbed%mf"
        />
      </head>
      <body>
        <div id="root"></div>
        ${htmlWebpackPlugin.tags.bodyTags}
      </body>
    </html>
  `,
    }),
  ],
  // externals: {
  //   react: 'react',
  //   'react-dom': 'react-dom',
  // },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    library: { name: 'U-Znth', type: 'umd' },
  },
}
