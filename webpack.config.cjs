const path = require('path');
const CircularDependencyPlugin = require('circular-dependency-plugin');
// const WorkerPlugin = require('worker-plugin');


module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: './src/index.ts',
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        extensionAlias: {
            ".js": [".js", ".ts", ".tsx"],
            ".cjs": [".cjs", ".cts"],
            ".mjs": [".mjs", ".mts"]
        },
        alias: {},
    },
    module: {
        rules: [
            {
                test: /\.([cm]?ts|tsx)$/,
                loader: 'ts-loader',
                exclude: /^(node_modules)$/
            },
            {
                test: /\.css$/,
                use: [
                  'style-loader',
                  'css-loader'
                ]
              }
        ]
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'index.js'
    },
    stats: {
        // Don't display heaps of crap
        all: false,
        colors: true,
        errors: true,
        builtAt: true
    },
    optimization: {
        minimize: false,
    },
    experiments: {
        outputModule: true
    },
    plugins: [
        // new WorkerPlugin()
        new CircularDependencyPlugin({
            exclude: /node_modules/,
            failOnError: true,
            allowAsyncCycles: false,
            // set the current working directory for displaying module paths
            cwd: process.cwd()
        })
    ]
};
