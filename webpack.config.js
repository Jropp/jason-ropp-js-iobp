const path = require("path");
const webpack = require("webpack");
const webpackMerge = require("webpack-merge");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const ManifestPlugin = require("webpack-manifest-plugin");
const manifestImport = require("./src/manifest.json");

const modeConfig = env => require(`./build-tools/webpack.${env}.js`)(env);

module.exports = env => {
  env = env || {};
  const mode = Object.keys(env)[0];

  return webpackMerge(
    {
      entry: "./src/index.js",
      output: {
        path: path.resolve(__dirname, "dist"),
        filename: "main.js"
      },
      module: {
        rules: [
          {
            test: /\.html$/,
            use: [
              { loader: "babel-loader" },
              {
                options: {
                  processStyleLinks: true
                },
                loader: "polymer-webpack-loader"
              }
            ]
          },
          {
            test: /\.js$/,
            use: [
              {
                loader: "babel-loader"
              }
            ]
          },
          {
            test: /\.css$/,
            use: [{ loader: "css-loader" }]
          }
        ]
      },
      plugins: [
        new webpack.NormalModuleReplacementPlugin(
          /\/node_modules\/@banno\/polymer\/polymer\.html$/,
          "@banno/polymer/polymer-element.js"
        ),
        new HtmlWebPackPlugin({
          template: path.resolve(__dirname, "./src/index.ejs"),
          alwaysWriteToDisk: true,
          inject: false,
          production: Boolean(env.production),
          filename: "index.html"
        }),
        new CopyWebpackPlugin([
          {
            from: path.resolve(
              __dirname,
              "./node_modules/@webcomponents/webcomponentsjs/*.js"
            ),
            to: "./webcomponentsjs/[name].[ext]"
          }
        ]),
        new ManifestPlugin({
          seed: manifestImport,
          writeToFileEmit: Boolean(env.production)
        }),
        new CleanWebpackPlugin(path.resolve("dist"))
      ]
    },
    modeConfig(mode)
  );
};
