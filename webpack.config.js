
const path = require('path')

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
    clean: true,
  },
  devtool: 'source-map',
  rules: [
    {
      test: /\.js$/,
      exclude: /(node_modules)/,
      use: ['babel-loader']
    },
    {
      test: /\.css$/i,
      use: ['style-loader', 'css-loader']
    }
]
}
