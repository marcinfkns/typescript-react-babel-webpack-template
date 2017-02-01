/*
  Based on https://webpack.github.io/docs/usage-with-gulp.html
*/

(function() {
    'use strict';

    // Build Runner
    var gulp = require('gulp');
  
    var _ = require('lodash');

    var webpack = require('webpack');
    var gulpWebpack = require('webpack-stream');

    var WebpackDevServer = require('webpack-dev-server');
    var HtmlWebpackPlugin = require('html-webpack-plugin');
    var CleanWebpackPlugin = require('clean-webpack-plugin');

    /*
     * Starts http dev server on localhost:8081 and watches source files for changes
     */
    gulp.task("dev", function (done) {
        var target = "dev";
        var opts = webPackOpts("dev", {
            devtool: 'inline-source-map',
            output: {
                path: __dirname + '/'+target
            }
        });

        var compiler = webpack(opts);
        console.log(compiler);

        new WebpackDevServer(compiler, {
            // server and middleware options
        }).listen(8081, "localhost", function(err) {
            if(err) throw new gutil.PluginError("webpack-dev-server", err);
            // Server listening
            console.log("[webpack-dev-server]", "http://localhost:8081/index.html, http://localhost:8081/tests.html");

            // keep the server alive or continue?
            // done();
        });
    });

    /*
     * Bundles the app (without minification) to the "build" directory
     */
    gulp.task("build", function () {
        var target = "build";
        var opts = webPackOpts(target, {
            devtool: 'source-map',
            entry: {
                tests: ['babel-polyfill'] //add babel-polyfill to the tests bundle - especially for testing in PhantomJS from Karma
            }
        });
        return gulp.src(["./app", "./spec"])
        .pipe( gulpWebpack(opts, webpack, function(err, stats) {}) )
        .pipe( gulp.dest(target) );
    });

    /*
     * Bundles the app (with minification) to the "dist" directory
     */
    gulp.task("dist", function () {
        var target = "dist";
        var opts = webPackOpts(target, {
            devtool: 'source-map',
            output: {
                //path: './dist',
                publicPath: '',
                filename: '[name].[chunkhash].js',
                sourceMapFilename: '[name].[chunkhash].map'
            },
            plugins: [
                new webpack.optimize.UglifyJsPlugin()
            ]
        });
        return gulp.src(["./app", "./spec"])
        .pipe( gulpWebpack(opts, webpack, function(err, stats) {}) )
        .pipe( gulp.dest(target) );
    });



    function _mergeArraysCustomizer(a, b) {
        if (_.isArray(a)) {
            return a.concat(b);
        }
    }

    function webPackOpts(target, extraOpts) {
        var commonOpts = {
            resolve: {
                extensions: ['', '.ts', '.tsx', '.js', '.es6.js', '.jsx']
            },
            entry: {
                main:  [
                    'babel-polyfill', 
                    './app/scripts/core/main.es6.js'//, './app/scripts/core/foo.es6.js', './app/scripts/core/foo2.ts'
                ],
                tests: [
                    //'babel-polyfill', 
                    //'./spec/specs/a/test.foo.ts', './spec/specs/test.foo.es6.js', './spec/specs/testEC6.es6.js'
                    './spec/specs/tests.es6.js'
                ]
            },
            output: {
                publicPath: '',
                filename: '[name].js',
                sourceMapFilename: '[name].map'
            },
            plugins: [
                new CleanWebpackPlugin([target]),
                new HtmlWebpackPlugin({
                    chunks: ['main'],
                    template: './app/index.html'
                }),
                new HtmlWebpackPlugin({
                    chunks: ['tests'],
                    template: './spec/tests.html',
                    filename: 'tests.html'
                }),
            ],
            module: {
                loaders: [
                    {
                    test: /\.js$/,
                    //include: path.join(__dirname, 'src'),
                    exclude: /(node_modules|bower_components)/,
                    loader: 'babel-loader',
                    query: {
                      presets: ["es2015", "stage-0"],
                      "plugins": ["transform-remove-strict-mode"]
                    }
                  }
                  ,
                  { test: /\.ts$/, loader: 'ts-loader' },
                  { test: /\.tsx$/, loader: 'ts-loader' },
                  {
                    test: /.jsx$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/,
                    query: {
                      presets: ['es2015', "stage-0", 'react']
                    }
                  }
                ]
            }
        };
        var opts = _.mergeWith({}, commonOpts, extraOpts, _mergeArraysCustomizer)

        return opts;
    }

}());
