const pkg = require('./package.json');
const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const production = process.env.NODE_ENV === 'production' || false;
const banner = `mp-progress.js v${pkg.version} https://www.npmjs.com/package/mp-progress`;

module.exports = {
    entry: './src/index.js',
    mode: 'production',
    output: {
        filename: production ? 'progress.min.js' : 'progress.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'MpProgress',
        libraryExport: 'default',
        libraryTarget: 'umd'
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }]
    },
    optimization: {
        minimize: production,
        minimizer: [
            new UglifyJSPlugin({
                parallel: require('os').cpus().length,
                uglifyOptions: {
                    warnings: false,
                    parse: {},
                    compress: {
                        pure_funcs: ['console.log'],
                    },
                    mangle: true, // Note `mangle.properties` is `false` by default.warnings: false,
                    output: {
                        beautify: false,
                        comments: (node, {value, type}) => type == 'comment2' && value.startsWith('!')
                    },
                    toplevel: true,
                    nameCache: null,
                    ie8: false,
                    keep_fnames: false,
                },
            })
        ]
    },
    plugins: [new webpack.BannerPlugin({ banner })]
};
