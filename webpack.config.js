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
    publicPath: "static"
  },
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "eslint-loader"
      }
    ],
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ]
  }
}
