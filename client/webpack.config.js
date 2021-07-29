const path = require('path');
const webpack = require('webpack');
const DirectoryNamedWebpackPlugin = require('directory-named-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const config = {
  mode: 'development',
  entry: [path.resolve(__dirname, 'index.js')] /* Loading Script Need */,
  output: {
    path: path.resolve(__dirname, '../public/dist'),
    filename: 'index.js' /* [name].js */,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/env'],
            plugins: ['@babel/plugin-transform-runtime'],
          },
        },
      },
      {
        test: /\.s[ac]ss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(jpe?g|png|svg|gif)$/,
        use: {
          loader: 'file-loader',
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      API_END_POINT:
        process.env.NODE_ENV === 'development'
          ? JSON.stringify('http://localhost:3000')
          : JSON.stringify(''),
    }),
  ],
  optimization: {},
  resolve: {
    modules: ['node_modules'],
    alias: {
      '@': path.resolve(__dirname, ''),
    },
    extensions: ['.js', '.json', '.jsx', '.css'],
    plugins: [new DirectoryNamedWebpackPlugin()],
  },
  devtool: 'eval-cheap-source-map',
};

module.exports = config;
