var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');
var path = require('path');

module.exports = {
    context: path.join(__dirname, "src"),
    devtool: debug ? "inline-sourcemap" : null,
    entry: "./js/client.js",
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
        path: __dirname + "/src/",
        filename: "client.min.js"
  },
    plugins: debug ? [] : [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
    ]
};
