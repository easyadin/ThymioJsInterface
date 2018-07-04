const path = require('path');
const webpack = require('webpack');

var nodeExternals = require('webpack-node-externals');

const browserConfig = {
    entry : [
        'babel-polyfill',
        './src/index.js'
    ],
    output: {
        filename: 'thymio.js',
        path: __dirname + "/dist/",
    },
    devtool: 'sourcemap',
    devServer: {
        hot : true,
        overlay: true,
        watchContentBase: true
    },
    module: {
        rules: [
            {
                test:  /\/src\/.*\.js$/,
                loader: 'babel-loader',
                options: {
                    presets: ['env']
                },
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ]
};


const nodeConfig = {
    target: 'node',
    entry : [
        './src/index.js'
    ],
    //externals: [nodeExternals()],
    output: {
        filename: 'thymio-node.js',
        path: __dirname + "/dist/",
    },
    devtool: 'sourcemap',
    module: {
        rules: [
            {
                test:  /\/src\/.*\.js$/,
                loader: 'babel-loader',
                options: {
                    "presets": [
                        ["env", { "targets": { "node": "current" } } ]
                    ]
                },
                exclude: /node_modules/
            }
        ]
    }
};

module.exports = [ browserConfig , nodeConfig];
