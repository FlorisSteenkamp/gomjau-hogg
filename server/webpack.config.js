const path = require('path');
const nodeExternals = require('webpack-node-externals');

const { NODE_ENV = 'development' } = process.env;


module.exports = {
    entry: './src/app.ts',
    mode: NODE_ENV,
    target: 'node',
    // devtool: 'cheap-source-map',
    node: {
        global: true,
        __dirname: false,
        __filename: false
    },
    externals: [nodeExternals()],
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: ['ts-loader']
            }
        ]
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'app.min.js',
        devtoolModuleFilenameTemplate: '[absolute-resource-path]'
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    stats: {
        // Don't display anything, then display colors, ...
        all: false,
        colors: true,
        errors: true,
        builtAt: true
    },
    optimization: {
        minimize: false
    }
}