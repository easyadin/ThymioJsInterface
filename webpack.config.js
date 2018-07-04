const path = require('path');
const webpack = require('webpack');
var babelenv = require('babel-preset-env');

const browserConfig = {
    entry : [
        'babel-polyfill',
        './src/index.js'
    ],
    output: {
        filename: 'thymio.js',
        path: __dirname + "/dist/",
    },
    mode: "development",
    devtool: 'sourcemap',
    devServer: {
        hot : true,
        overlay: true,
        watchContentBase: true
    },
    module: {
        rules: [
            {
                test:  /\.*\.js$/,
                loader: 'babel-loader',
                exclude: /(node_modules\/babel-polyfill)/,
                options: {
                    presets: [
                        [
                            babelenv , {
                                "targets": {
                                    "browsers": ["> 3%", "ie >= 10"]
                                }
                            }
                        ]
                    ]
                }
            }
        ]
    }
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
