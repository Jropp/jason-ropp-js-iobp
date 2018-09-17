const webpack = require("webpack");

module.exports = () => {
  console.log("producing");
  return {
    output: {
      filename: "[chunkhash].js"
    }
  };
};
