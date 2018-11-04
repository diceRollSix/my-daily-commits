'use strict';

const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = (env, argv) => {
    const isProd = argv.mode === 'production';
    const baseUrl = isProd
        ? '/my-daily-commits/'
        : '/';

    return {
        entry: [
            './src/main.js'
        ],
        output: {
            path: path.join(__dirname, 'dist'),
            filename: isProd ? 'app.[hash].js' : 'app.js',
            publicPath: baseUrl
        },
        module: {
            rules: [
                {
                    test: /\.vue$/,
                    use: 'vue-loader'
                },
                {
                    test: /\.js$/,
                    use: 'babel-loader'
                },
                {
                    test: /\.css$/,
                    use: [
                        isProd ? MiniCssExtractPlugin.loader : 'vue-style-loader',
                        'css-loader'
                    ]
                }
            ],
        },
        watchOptions: {
            ignored: /node_modules/,
            aggregateTimeout: 300,
            poll: 1000
        },
        resolve: {
            extensions: ['*', '.js', '.vue', '.json']
        },
        optimization: {
            minimizer: [
                new UglifyJsPlugin({
                    cache: true,
                    parallel: true,
                    sourceMap: false
                }),
                new OptimizeCSSAssetsPlugin({})
            ]
        },
        plugins: [
            new VueLoaderPlugin(),
            new HtmlWebpackPlugin({
                filename: 'index.html',
                template: './public/index.html',
                favicon: './public/favicon.ico',
                inject: true
            }),
            new MiniCssExtractPlugin({
                filename: isProd ? 'app.[hash].css' : 'app.css',
            })
        ]
    };
};

