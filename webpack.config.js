const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const { title } = require('process');

module.exports = {
  mode: 'development',
  entry: {
     main: path.resolve(__dirname, 'solution/index.js')
},
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    clean: true,
  },
  devtool: 'inline-source-map',
  devServer: {
    static: path.resolve(__dirname, 'dist'),
    port: 5500,
    open: true,
    hot: true,
    watchContentBase: true,
  },
  //loaders
  module: {
    rules: [
      //css 
      {test: /\.css$/, use: ['style-loader', 'css-loader']},
    ]
  },
  //plugins
  plugins:[new HtmlWebPackPlugin({
      title: 'tasks manager',
      filename: 'index.bundle.html',
      template: path.resolve(__dirname, 'solution/index.html')
    })
  ],
}
