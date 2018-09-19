const path = require("path");

module.exports = () => {
  return {
    devServer: {
      contentBase: path.join(__dirname, "dist"),
      compress: true,
      port: 1820
    },
    devtool: "source-map"
  };
};
