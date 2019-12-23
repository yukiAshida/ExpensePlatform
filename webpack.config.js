module.exports = {
  entry: {
    app: "./app/views/src/index.js"
  },
  output: {
    path: __dirname + '/app/views/statics/js',
    // path: __dirname + '/templates/statics/js',
    filename: "index.js"
  },
    devServer: {
    contentBase: __dirname + '/app/views/templates',
    port: 8000,
    publicPath: __dirname + '/app/views/statics/js/'
    // publicPath: '/statics/js/'
  },
  devtool: "eval-source-map",
  mode: 'development',
  module: {
    rules: [{
      test: /\.js$/,
      enforce: "pre",
      exclude: /node_modules/,
      loader: "eslint-loader"
    }, {
      test: /\.css$/,
      loader: ["style-loader","css-loader"]
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
     },{
      // 追記
      test: /\.(jpg|png)$/,
      loaders: 'url-loader'
    }]
  }
};