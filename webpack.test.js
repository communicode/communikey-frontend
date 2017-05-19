"use strict";

const webpack = require("webpack");
const BabiliPlugin = require("babili-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

if (typeof process.env.COMMUNIKEY_BACKEND_URL === "undefined") {
  throw new Error("COMMUNIKEY_BACKEND_URL environment variable is undefined");
}
const COMMUNIKEY_BACKEND_URL = process.env.COMMUNIKEY_BACKEND_URL;

if (typeof process.env.COMMUNIKEY_FRONTEND_URL === "undefined") {
  throw new Error("COMMUNIKEY_FRONTEND_URL environment variable is undefined");
}
const COMMUNIKEY_FRONTEND_URL = process.env.COMMUNIKEY_FRONTEND_URL;

module.exports = {
  entry: "./src/js/client.js",

  output: {
    path: path.join(__dirname, "dist"),
    filename: "client.min.js"
  },

  resolve: {
    modules: ["node_modules", "./src"]
  },

  module: {
    rules: [
/*      {
        enforce: "pre",
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: "eslint-loader",
        options: {
          failOnError: true,
          failOnWarning: false
        }
      },*/
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
        test: /\.(jpg|png|gif)$/,
        use: "file-loader?limit=1024&name=[name].[ext]"
      },
      {
        test: /\.(woff|woff2|eot|ttf|[ot]tf|svg)$/,
        use: "url-loader?limit=1024&name=[name].[ext]"
      }
    ]
  },

  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new BabiliPlugin({
      comments: false
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html"
    }),
    new webpack.DefinePlugin({
      "process.env": {
        "NODE_ENV": JSON.stringify("production"),
        "COMMUNIKEY_BACKEND_URL": JSON.stringify(COMMUNIKEY_BACKEND_URL),
        "COMMUNIKEY_FRONTEND_URL": JSON.stringify(COMMUNIKEY_FRONTEND_URL)
      }
    })
  ]
};