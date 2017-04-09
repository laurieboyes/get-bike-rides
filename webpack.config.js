var webpack = require('webpack');
var libraryName = 'get-bike-rides';

module.exports = {
    entry: {
        'get-bike-rides': './index.js',
        'get-bike-rides.min': './index.js',
    },
    output: {
        path: __dirname + '/dist',
        filename: '[name].js',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            }
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            include: /\.min\.js$/,
            minimize: true
        })
    ]
};