const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  devtool: "cheap-module-source-map",
  entry: "./src/Communikey.js",

  output: {
    path: path.join(__dirname, "dist"),
    filename: "communikey.min.js",
    sourceMapFilename: "[file].map",
    publicPath: "/"
  },

  devServer: {
    contentBase: "src",
    proxy: {
      "/api/**": {
        "target": "http://localhost:8080",
        "secure": false
      },
      "/api**": {
        "target": "http://localhost:8080",
        "secure": false
      },
      "/oauth/**": {
        "target": "http://localhost:8080",
        "secure": false
      }
    }
  },

  resolve: {
    modules: ["node_modules", "./src"]
  },

  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: "eslint-loader",
        options: {
          failOnError: true,
          failOnWarning: false
        }
      },
      {
        test: /\.js?$/,
        exclude: /(node_modules)/,
        use: "babel-loader"
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader","less-loader"]
      },
      {
        test: /\.(jpg|png|gif)$/,
        use: "file-loader"
      },
      {
        test: /\.(woff|woff2|eot|ttf|[ot]tf|svg)$/,
        use: "url-loader"
      }
    ]
  },

  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: false,
      debug: true,
      sourceMap: true
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html"
    })
  ]
};