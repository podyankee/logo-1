// Libraries
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackNotifierPlugin = require("webpack-notifier");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");

// Files
const utils = require("./utils");
const plugins = require("../postcss.config");

// Configuration
module.exports = (env) => {
  return {
    context: path.resolve(__dirname, "../src"),
    entry: {
      app: "./app.js",
    },
    output: {
      path: path.resolve(__dirname, "../dist"),
      publicPath: "/",
      filename: "assets/js/[name].[hash:7].bundle.js",
    },
    devServer: {
      contentBase: path.resolve(__dirname, "../src"),
    },
    resolve: {
      extensions: [".js"],
      alias: {
        source: path.resolve(__dirname, "../src"), // Relative path of src
        images: path.resolve(__dirname, "../src/assets/images"), // Relative path of images
        fonts: path.resolve(__dirname, "../src/assets/fonts"), // Relative path of fonts
      },
    },

    /*
      Loaders with configurations
    */
    module: {
      rules: [{
          test: /\.js$/,
          exclude: [/node_modules/],
          use: [{
            loader: "babel-loader",
            options: {
              presets: ["es2015"]
            },
          }, ],
        },
        {
          test: /\.scss$/,
          use: [
            'style-loader',
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                sourceMap: true
              }
            }, {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
                config: {
                  path: `./postcss.config.js`
                }
              }
            }, {
              loader: 'sass-loader',
              options: {
                sourceMap: true
              }
            }
          ]
        }, {
          test: /\.css$/,
          use: [
            'style-loader',
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                sourceMap: true
              }
            }, {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
                config: {
                  path: `./postcss.config.js`
                }
              }
            }
          ]
				},
				{
          test: /\.pug$/,
          use: [{
            loader: "pug-loader",
          }, ],
        },
        {
          test: /\.(png|jpe?g|gif|svg|ico)(\?.*)?$/,
          loader: "url-loader",
          options: {
            limit: 3000,
            name: "assets/images/[name].[hash:7].[ext]",
          },
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          loader: "url-loader",
          options: {
            limit: 10000,
            name: "assets/fonts/[name].[hash:7].[ext]",
          },
        },
        {
          test: /\.(mp4)(\?.*)?$/,
          loader: "url-loader",
          options: {
            limit: 10000,
            name: "assets/videos/[name].[hash:7].[ext]",
          },
        },
      ],
    },
    optimization: {
      minimizer: [
        new TerserPlugin({
          cache: true,
          parallel: true,
          sourceMap: true,
        }),
      ],
      splitChunks: {
        cacheGroups: {
          default: false,
          vendors: false,
          // vendor chunk
          vendor: {
            filename: "assets/js/vendor.[hash:7].bundle.js",
            // sync + async chunks
            chunks: "all",
            // import file path containing node_modules
            test: /node_modules/,
          },
        },
      },
    },

    plugins: [
      new CopyWebpackPlugin({
        patterns: [{
          from: "assets/images",
          to: "assets/images",
        }, ],
      }),
      new MiniCssExtractPlugin({
        filename: "assets/css/[name].[hash:7].bundle.css",
        chunkFilename: "[id].css",
      }),

      /*
        Pages
      */

      // // Desktop page
      new HtmlWebpackPlugin({
        filename: "index.html",
        template: "views/index.pug",
        inject: true,
      }),

      ...utils.pages(env),
      // ...utils.pages(env, "blog"),

      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.$": "jquery",
        "window.jQuery": "jquery",
      }),
      new WebpackNotifierPlugin({
        title: "Logo project",
      }),
    ],
  };
};
