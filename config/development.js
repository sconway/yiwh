const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: path.resolve(__dirname, '..', 'src/client/index.tsx'),

    output: {
        path: path.resolve(__dirname, '..', 'dist'),
        publicPath: '/dist/',
        filename: 'client.js'
    },

    devtool: "source-map",

    devServer: {
        contentBase: path.resolve(__dirname, '..', 'src/client'),
        publicPath: '/dist/'
    },

    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        modules: [
            path.join(__dirname, '../src'),
            "node_modules"
        ]
    },

    module: {
        rules: [
            { 
                test: /\.(ts|tsx)$/, 
                loader: 'awesome-typescript-loader' 
            },
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'react', 'stage-0']
                }
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
            },
            {
                test: /\.(ttf|eot|otf|svg|png)$/,
                loader: 'file-loader'
            },
            {
                test: /\.(woff|woff2)$/,
                loader: 'url-loader'
            }
        ]
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env':{
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        
        new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            sourceMap: true,
            compress:{
                sequences: true,
                dead_code: true,
                conditionals: true,
                booleans: true,
                unused: true,
                if_return: true,
                join_vars: true,
                // drop_console: true,  // change to true for live release
                warnings: false // set to true if you want hundreds of extra output lines :)
            }
        })
    ]
};