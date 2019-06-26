
// webpack v4
const path = require('path');
const webpack = require('webpack'); //to access built-in plugins
const WebpackMd5Hash = require('webpack-md5-hash');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin")

const modeDev = 'development';

const configFn = (env, argv) => {
    
    const mode = argv ? argv.mode : modeDev;
    const development = mode ===  modeDev;

    console.log('Build mode: [' + mode + ']');

    var config = {
        mode: mode,
        devServer: {
			// Include resources so index.html will be served
            contentBase: [path.join(__dirname, 'public'), path.join(__dirname, 'dist')],
            compress: false,
            port: 9099
        },
        devtool: argv.mode === 'development' ? 'eval-source-map' : undefined,
        entry: {
            'moneris-lib': './src/main/library.ts'
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            publicPath: env.cdn,
            filename: '[name].js',
            chunkFilename: '[name]-[chunkhash].js',
			// Using <script> tag, all entries will be exposed via Moneris.[name] global.
            library: ["Moneris", "[name]"],
            libraryTarget: "umd",
//            devtoolModuleFilenameTemplate: '../[resource-path]',
        },
        module: {
            rules: [{
				// to execute javascript on global once.
                test: /_[^\/]*\.js$/,
                exclude: /node_modules/,
                use: [ 'script-loader' ]
            },
            {
                test: /\.(sc|c)ss$/,
                exclude: /node_modules/,
                use: [ // loader: 'style-loader', // Adds CSS to the DOM by injecting a <style> tag
                    {
                        loader: MiniCssExtractPlugin.loader // Extract css
                    },
                    {
                        loader: 'css-loader', // Convert CSS to CommonJS
                        options: { importLoaders: 2 } 
                    },
                    {
                        loader: 'postcss-loader' // see postcss.config.js
                    },
                    {
                        loader: 'sass-loader'  // Compile to sass
                    }]
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [ 'ts-loader' ]
            }]
        },
        resolve: {
            extensions: ['.js', '.json', '.ts']
        },        
        externals: {
            moment: 'moment',
            $: '$'
        },
        plugins: [
            new webpack.LoaderOptionsPlugin({
                //test: /postcss-loader$/, // only for this module
                options: {
                    mode: mode
                }
            }),
            new WebpackMd5Hash(),
            new MiniCssExtractPlugin({
                filename: '[name]-[chunkhash].css',
            }),
        ]
    };

    if (development) {
        // Enable debug in development mode (to see source code in Browser devtools)
        config.plugins.push(
            new webpack.LoaderOptionsPlugin({
                debug: true
            })
        );
    } else {
        config.plugins.push(
            new CompressionPlugin({
                asset: '[path].gz[query]',
                algorithm: 'gzip',
                test: /\.js$|\.css$|\.html$/,
                threshold: 100,
                minRatio: 0.9
            })
        );
    }
    // Ignore all locale files of moment.js
    config.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/));

    // Don't destroy dist folder with webpack-dev-server
    if(!env || !env.WEBPACK_DEV_SERVER) {
        config.plugins.unshift(new CleanWebpackPlugin('dist', {}));
    }

    console.log('Config: [' + JSON.stringify(config) + ']');

    return config;
};

module.exports = (env, argv) => { 
    return configFn(env, argv); 
};