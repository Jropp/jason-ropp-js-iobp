const webpack = require("webpack");
const path = require("path");
const webpackBundleAnalyzer = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const MinifyPlugin = require("babel-minify-webpack-plugin");

module.exports = () => {
  return {
    plugins: [
      new webpackBundleAnalyzer(),
      new MinifyPlugin()]
  };
};
