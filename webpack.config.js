// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';

  return {
    entry: './frontend/src/App.js',
    output: {
      filename: isProd ? '[name].[contenthash].js' : '[name].js',
      path: path.resolve(__dirname, 'dist'),
      clean: true, // Cleans the dist folder before each build
      publicPath: '/'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"]
            }
          }
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader, 
            "css-loader" 
          ],
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg)$/i,
          type: 'asset/resource'
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './frontend/public/index.html',
        filename: 'index.html',
      }),
      new MiniCssExtractPlugin({
        filename: isProd ? '[name].[contenthash].css' : '[name].css'
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from: 'frontend/public/assets', to: 'assets' },
          { from: 'frontend/public/robots.txt', to: 'robots.txt' } 
        ]
      })
    ],
    devServer: {
      // Instead of serving from "frontend/public" as root, we serve it at "/public"
      static: {
        directory: path.join(__dirname, 'frontend/public'),
        publicPath: '/' // Serve assets at the root, same as production
      },
      historyApiFallback: true, // For SPA routing.
      port: 8080,
      open: true
    },
    optimization: {
      minimize: isProd,
      minimizer: isProd
      ? [
          `...`, // Keep default JS minimizer (Terser)
          new CssMinimizerPlugin() // Minify CSS
        ]
      : []
    }
  };
};
