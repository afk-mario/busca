const path = require('path');

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: { search: './src/search.js', options: './src/options.js' },
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
};
