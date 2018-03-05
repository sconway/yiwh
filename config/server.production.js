const nodeExternals = require('webpack-node-externals');
const path = require('path');

module.exports = {
    target: 'node',

    externals: [nodeExternals()],

    entry: path.resolve(__dirname, '..', 'src/server/index.tsx'),

    output: {
        path: path.resolve(__dirname, '..', 'dist'),
        publicPath: '/dist/',
        filename: 'server.js',
        library: 'app',
        libraryTarget: 'commonjs2'
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
                use: ['css-loader', 'sass-loader']
            },
            {
                test: /\.(ttf|eot|otf|svg|png)$/,
                loader: 'file-loader?emitFile=false'
            },
            {
                test: /\.(woff|woff2)$/,
                loader: 'url-loader?emitFile=false'
            }
        ]
    }
};