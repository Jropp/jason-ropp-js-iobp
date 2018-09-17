const webpack = require("webpack");
const webpackMerge = require("webpack-merge");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require("path");
const modeConfig = env => require(`./build-tools/webpack.${env}.js`)(env);

module.exports = env => {
  env = env || {};
  let mode = Object.keys(env)[0];

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
            // If you see a file that ends in .html, send it to these loaders.
            test: /\.html$/,
            // This is an example of chained loaders in Webpack.
            // Chained loaders run last to first. So it will run
            // polymer-webpack-loader, and hand the output to
            // babel-loader. This let's us transpile JS in our `<script>` elements.
            use: [
              { loader: "babel-loader" },
              {
                options: {
                  // pulls out imports on user component and resolves into css dependency to send through css loader
                  processStyleLinks: true
                },
                loader: "polymer-webpack-loader"
              }
            ]
          },
          {
            // If you see a file that ends in .js, just send it to the babel-loader.
            test: /\.js$/,
            use: [
              {
                loader: "babel-loader"
              }
            ]
            // Optionally exclude node_modules from transpilation except for polymer-webpack-loader:
            // exclude: /node_modules\/(?!polymer-webpack-loader\/).*/
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
        // This plugin will generate an index.html file for us that can be used
        // by the Webpack dev server. We can give it a template file (written in EJS)
        // and it will handle injecting our bundle for us.
        new HtmlWebPackPlugin({
          template: path.resolve(__dirname, "./src/index.ejs"),
          alwaysWriteToDisk: true,
          inject: false,
          production: Boolean(env.production),
          filename: "index.html"
        }),
        // This plugin will copy files over for us without transforming them.
        // That's important because the custom-elements-es5-adapter.js MUST
        // remain in ES2015.
        new CopyWebpackPlugin([
          {
            from: path.resolve(
              __dirname,
              "./node_modules/@webcomponents/webcomponentsjs/*.js"
            ),
            to: "./webcomponentsjs/[name].[ext]"
          }
        ])
      ]
    },
    modeConfig(mode)
  );
};

// Anything that wp doesn't generate on its own gets served out of dist
