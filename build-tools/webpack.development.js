const webpack = require("webpack");

module.exports = () => {
  console.log("developing");
  return {
    devServer: {
      contentBase: path.join(__dirname, "dist"),
      compress: true,
      port: 1820
    }
  };
};
