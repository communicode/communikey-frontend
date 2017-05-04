let debug = process.env.NODE_ENV !== "production";
let webpack = require('webpack');
let path = require('path');
let CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    context: path.join(__dirname, "src"),
    devtool: debug ? "inline-sourcemap" : "",
    entry: "./js/client.js",
    devServer: {
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
    module: {
        loaders: [
        {
            test: /\.jsx?$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel-loader',
            query:
            {
                presets: ['react', 'es2015', 'stage-0'],
                plugins: ['react-html-attrs', 'transform-decorators-legacy', 'transform-class-properties'],
            }
        },
        {
            test: /\.css$/,
            loaders: ['style-loader', 'css-loader']
        },
        {
            test: /\.(eot|png|svg|[ot]tf|woff2?)(\?v=\d+\.\d+\.\d+)?$/,
            loader: 'url-loader',
            query: {limit: 10000}
        }
    ]
  },
    output: {
        path: __dirname + "/dist",
        filename: "client.min.js"
  },
    plugins: debug ? [ ] : [
        new CopyWebpackPlugin([
          { from: 'index.html', to: '../dist/index.html'}
        ]),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin()
    ]
};
