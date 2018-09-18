const MinifyPlugin = require("babel-minify-webpack-plugin");

module.exports = () => {
  return {
    plugins: [
      new MinifyPlugin(),
    ]
  };
};
