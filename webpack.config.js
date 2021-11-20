const path = require("path")
const HTMLWebpackPlugin = require("html-webpack-plugin")
const {CleanWebpackPlugin} = require("clean-webpack-plugin")

module.exports = {
  mode: "development",
  entry: "./src/scripts/index.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js"
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node-modules/
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          "css-loader"
        ]
      }
    ]
  },

  plugins: [
    new HTMLWebpackPlugin({
      template: "index.html"
    }),
    new CleanWebpackPlugin()
  ],

  resolve: {
    extensions: [".js", ".ts"]
  }

}
