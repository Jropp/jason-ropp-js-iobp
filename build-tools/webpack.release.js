const webpack = require("webpack");

module.exports = () => {
  console.log("releasing");
  return {
    output: {
      filename: "[chunkhash].js"
    }
  };
};
