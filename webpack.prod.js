/*
 * This file is part of communikey.
 * Copyright (C) 2016-2018  communicode AG <communicode.de>
 *
 * communikey is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
const webpack = require("webpack");
const BabiliPlugin = require("babili-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
const path = require("path");

if (typeof process.env.COMMUNIKEY_BACKEND_URL === "undefined") {
  throw new Error("COMMUNIKEY_BACKEND_URL environment variable is undefined");
}
const COMMUNIKEY_BACKEND_URL = process.env.COMMUNIKEY_BACKEND_URL;

if (typeof process.env.COMMUNIKEY_FRONTEND_URL === "undefined") {
  throw new Error("COMMUNIKEY_FRONTEND_URL environment variable is undefined");
}
const COMMUNIKEY_FRONTEND_URL = process.env.COMMUNIKEY_FRONTEND_URL;

if (typeof process.env.COMMUNIKEY_VERSION === "undefined") {
  throw new Error("COMMUNIKEY_VERSION environment variable is undefined");
}
const COMMUNIKEY_VERSION = process.env.COMMUNIKEY_VERSION;

const extractLess = new ExtractTextPlugin({
  filename: "[name].[contenthash].css",
  disable: process.env.NODE_ENV === "development",
  allChunks: true
});

module.exports = {
  entry: "./src/Communikey.js",

  output: {
    path: path.join(__dirname, "dist"),
    filename: "communikey.min.js",
    publicPath: "/"
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
        use: extractLess.extract({
          use: [{
            loader: "css-loader"
          }, {
            loader: "less-loader"
          }],
          fallback: "style-loader"
        })
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

  node: {
    console: true,
    net: "empty"
  },

  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new BabiliPlugin({
      comments: false
    }),
    extractLess,
    new HtmlWebpackPlugin({
      template: "./src/index.html"
    }),
    new FaviconsWebpackPlugin({
      logo: "./src/assets/images/communikey-logo-light-dropshadow.svg"
    }),
    new webpack.DefinePlugin({
      "process.env": {
        "NODE_ENV": JSON.stringify("production"),
        "COMMUNIKEY_BACKEND_URL": JSON.stringify(COMMUNIKEY_BACKEND_URL),
        "COMMUNIKEY_FRONTEND_URL": JSON.stringify(COMMUNIKEY_FRONTEND_URL),
        "COMMUNIKEY_VERSION": JSON.stringify(COMMUNIKEY_VERSION)
      }
    })
  ]
};
