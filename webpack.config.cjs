const path = require('path');
const CircularDependencyPlugin = require('circular-dependency-plugin');
// const WorkerPlugin = require('worker-plugin');


module.exports = {
    // mode: 'development',
    mode: 'production',
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
            }
        ]
    },
    output: {
        path: path.resolve(__dirname, './node'),
        filename: 'index.js'
    },
    stats: {
        // Don't display most things
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
