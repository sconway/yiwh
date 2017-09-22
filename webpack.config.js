'use strict';

const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const extractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

const config = {
    devtool: 'source-map',

    entry: ['babel-polyfill', './index.js'],

    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                loader: 'babel-loader',
                query: {
                    cacheDirectory: true,
                    plugins: [
                        'transform-class-properties'
                    ],
                    presets: [['es2015', {modules: false}], 'stage-2', 'react'],
                    babelrc: false
                }
            },
            {
                test: /\.scss$/,
                use: extractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [{
                      loader: 'css-loader'
                    }, {
                      loader: 'postcss-loader',
                      options: {
                        plugins: (loader) => [
                          autoprefixer
                        ]
                      }
                    }, {
                      loader: 'sass-loader'
                    }]
                })
            },
            {
                test: /\.(svg|jpg|png)$/,
                loader: 'file-loader?name=/media/[name].[ext]'
            }
        ]
    },

    output: {
        path: path.join(__dirname, './build'),
        publicPath: '/build',
        filename: '[name].js'
    },

    plugins: [
        new extractTextPlugin({
            filename: '[name].css',
            disable: false,
            allChunks: true
        }),

        // sets environment variable. for the real app, this needs to be set in teamcity
        new webpack.DefinePlugin({
            'process.env':{
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        
        // uglfy / minify js
        new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            sourceMap: true,
            // compress:{
            //     sequences: true,
            //     dead_code: true,
            //     conditionals: true,
            //     booleans: true,
            //     unused: true,
            //     if_return: true,
            //     join_vars: true,
            //     drop_console: true,  // change to true for live release
            //     warnings: false // set to true if you want hundreds of extra output lines :)
            // }
        })
    ],

    resolve: {
        extensions: ['.js', '.jsx', '.scss'],
        modules: [
            path.join(__dirname, './src'),
            "node_modules"
        ]
    }
};


module.exports = config;