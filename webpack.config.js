const path = require("path")

module.exports = {
  devtool: "inline-source-map",
  entry: {
    parser: "./export/parser",
    synth: "./export/synth"
  },
  output: {
    path: path.join(__dirname, "bin"),
    filename: "sf2.[name].js",
    library: "[name]",
    libraryTarget: "umd"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
        enforce: "pre"
      },
      {
        test: /\.ts$/,
        exclude: [/node_modules/, /\.test.ts$/],
        loader: "ts-loader"
      }
    ]
  }
}
