const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: { search: './src/search.js' },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist/'),
    sourceMapFilename: '[name].map',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },

  plugins: [
    new CleanWebpackPlugin('dist'),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, './src/public'),
        to: path.resolve(__dirname, 'dist'),
      },
    ]),
  ],
};
