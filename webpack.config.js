var webpack = require('webpack'),
    path = require('path');


module.exports = {
  context: path.join(__dirname),
  entry: {
    scene: "./src/js/scene.js"
  },
  output: {
    path: path.join(__dirname, "./dist/js"),
    filename: "[name].js"
  },
  resolve: {
    modules: [ path.resolve('./src/js'), "node_modules" ]
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['babel-preset-env']
          }
        }
      }
    ]
  }
}
