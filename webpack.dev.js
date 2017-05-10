"use strict";

const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const { URL } = require("url");

const COMMUNIKEY_BACKEND_URL = () => {
  return process.env.COMMUNIKEY_BACKEND_URL !== "undefined" ? process.env.COMMUNIKEY_BACKEND_URL : new URL("http://localhost:8080");
};

const COMMUNIKEY_FRONTEND_URL = () => {
  return process.env.COMMUNIKEY_FRONTEND_URL !== "undefined" ? process.env.COMMUNIKEY_FRONTEND_URL : new URL("http://localhost:8081");
};

module.exports = {
  devtool: "cheap-module-source-map",
  entry: "./src/js/client.js",

  output: {
    path: path.join(__dirname, "dist"),
    filename: "client.min.js",
    sourceMapFilename: "[file].map",
    publicPath: "/"
  },

  devServer: {
    contentBase: "src",
    proxy: {
      "/api**": {
        "target": JSON.stringify(COMMUNIKEY_BACKEND_URL),
        "secure": false
      },
      "/oauth/**": {
        "target": JSON.stringify(COMMUNIKEY_BACKEND_URL),
        "secure": false
      }
    }
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        use: "babel-loader"
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
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
      debug: true
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