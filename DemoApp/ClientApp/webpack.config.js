const webpack = require('webpack');

module.exports = {
    mode: 'production',
    entry: {
        vendor: ['@babel/polyfill', 'eventsource-polyfill', 'react', 'react-dom'],
        app: ['@babel/polyfill', 'eventsource-polyfill', './client.js'],
    },
    output: {
        path: 'dist',
        filename: '[name].js',
        publicPath: '/',
    },
    module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            include: /src/
          },
          {
            test: /\.(js|jsx)$/,
            use: 'react-hot-loader/webpack',
            include: /node_modules/
          }]
    },
    plugins: [],
    optimization: {},
    resolve: {
        modules: ['node_modules'],
        extensions: ['.js', '.json', '.jsx', '.css'],
        // alias: { 'react-dom': '@hot-loader/react-dom'  }
    },
}