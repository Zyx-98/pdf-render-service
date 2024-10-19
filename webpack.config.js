const path = require("path");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const fs = require("fs");
const nodeModules = {};

fs.readdirSync("node_modules")
  .filter(function (x) {
    return [".bin"].indexOf(x) === -1;
  })
  .forEach(function (mod) {
    nodeModules[mod] = "commonjs " + mod;
  });

module.exports = {
  entry: "./src/index.ts",
  target: "node",
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: "ts-loader",
        exclude: /(node_modules|bench)/,
      },
    ],
  },
  externals: nodeModules,
  resolve: {
    extensions: [".ts", ".js"],
    plugins: [new TsconfigPathsPlugin()]
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
};