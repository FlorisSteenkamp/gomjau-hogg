const path = require('path');
// const WorkerPlugin = require('worker-plugin');


module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: './src/index.tsx',
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
        path: path.resolve(__dirname, '../server/build/static'),
        // path: path.resolve(__dirname),
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
        outputModule: true,
        asyncWebAssembly: true
    },
    plugins: []
};