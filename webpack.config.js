const webpack = require('webpack');

module.exports = {
    entry: './src/main.js',
    output: {
        path: './',
        filename: 'main.js',
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
        }]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: { warnings: false, },
            output: { comments: false, },
        }),
    ],
    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
    }
};
