/**
 * Created by wush1 on 2017/5/21.
 */
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const config = require('./src/example.config');
const glob = require('glob');


module.exports = (env)=> {
    let entries = {};
    for (let i in config.jsPath) {
        entries[config.jsPath[i]] = path.resolve(__dirname, "src/view/" + config.jsPath[i]);
    }
    let additionPlugins = [
        new CleanWebpackPlugin(["dist/" + (env.production ? "release" : "dev")], {
            verbose: true
        }),
        new ExtractTextPlugin({
            filename: "css/" + (env.production ? "[name].[chunkhash:6].css" : "[name].css"),
            allChunks: true
        })

    ];
    if (!env.production) {
        additionPlugins.push(new webpack.SourceMapDevToolPlugin({
            filename: '[name].js.map',
        }));
    } else {
        additionPlugins.push(new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                drop_console: true
            },
            mangle: true
        }));
    }

    for (let i in entries) {
        let htmlPosition = i.replace(/-controller/i, "");
        //(env.production ? ".[chunkhash:6].html" : ".html"
        additionPlugins.push(
            new HtmlWebpackPlugin({
                filename: htmlPosition + ".html",
                chunks: [i, "example.all"],
                template: "src/view/" + htmlPosition + ".html",
                inject: "body"
            })
        );
    }
    let cssEntries = [];
    var cssFiles = glob.sync("src/**/*.css");
    for (let i in cssFiles) {
        cssEntries.push(path.resolve(__dirname, cssFiles[i]));
    }
    entries["example.all"] = cssEntries;
    return {
        entry: entries,
        output: {
            filename: env.production ? 'js/[name].[chunkhash:6].js' : 'js/[name].js',
            path: path.resolve(__dirname, env.production ? 'dist/release' : 'dist/dev')
        },
        resolve: {
            modules: [
                path.resolve(__dirname, "./src/vendors/3rd/"),
                path.resolve(__dirname, "./src/view/"),
                path.resolve(__dirname, "./src/components/directives/"),
                path.resolve(__dirname, "./src/components/services/"),
                "node_modules"
            ]
        },
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: ExtractTextPlugin.extract({
                        use: "css-loader"
                    })
                },
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: "eslint-loader"
                        },
                        {
                            loader: 'babel-loader',
                            options: {
                                presets: ['es2015']
                            }
                        }]
                }
            ]
        },
        plugins: additionPlugins,
        devServer: {
            contentBase: path.join(__dirname, "dist/dev"),
            compress: false,
            port: 9000
        }
    };
};