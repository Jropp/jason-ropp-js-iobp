const MinifyPlugin = require("babel-minify-webpack-plugin");
const WorkboxPlugin = require("workbox-webpack-plugin");

module.exports = () => {
  return {
    plugins: [
      new MinifyPlugin(),
      new WorkboxPlugin.GenerateSW()
    ]
  };
};
