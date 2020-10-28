const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
// const globSync = require("glob").sync;

module.exports = (env, options) => ({
  entry: ["./src/index.js"],
  devServer: {
    contentBase: "./dist"
  },
//   devtool: "source-map",
  node: {
    fs: 'empty'
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          options.mode !== "production"
            ? "style-loader"
            : {
                loader: MiniCssExtractPlugin.loader,
                // options: {
                //   publicPath: "../"
                // }
              },
          "css-loader",
          {
            loader: 'postcss-loader', 
            options: {
              plugins: function () {
                return [
                  require('precss'),
                  require('autoprefixer')
                ];
              }
            }
          },
          "sass-loader"
        ]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "img/"
            }
          }
        ]
      },
      {
        test: /\.(html)$/,
        use: {
          loader: "html-srcsets-loader",
          options: {
            attrs: [":src", ':srcset']
          }
        }
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/[name].[contenthash].css"
    }),
    new HtmlWebpackPlugin({
        template: "src/index.html"
    }),
    // new CleanWebpackPlugin()

    new CleanWebpackPlugin(["dist"]),
    // ...globSync("src/**/*.html").map(fileName => {
    //   return new HtmlWebpackPlugin({
    //     template: fileName,
    //     inject: "body",
    //     filename: fileName.replace("src/", "")
    //   });
    // }),
  ],
  output: {
    filename: "[name].[contenthash].js",
    path: path.resolve(__dirname, "dist"),
    publicPath: ""
  }
});