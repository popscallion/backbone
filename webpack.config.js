const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const workboxPlugin = require('workbox-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: './src/index.js',
	mode: 'development',

	output: {
		chunkFilename: '[name].[chunkhash].js',
		filename: 'bundle.js',
		path: path.resolve(__dirname, "build/"),
		publicPath: "/build/",
	},

	plugins: [
		new webpack.ProgressPlugin(),
		new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Hot Module Replacement',
    }),
		new workboxPlugin.GenerateSW({
			swDest: 'sw.js',
			clientsClaim: true,
			skipWaiting: false
		})
	],

	devServer: {
    contentBase: path.join(__dirname, "public/"),
		port: 3000,
		publicPath: "http://localhost:3000/build/",
   	hot: true,
  },

	module: {
		rules: [
			{
				test: /\.js$/,
				include: /src/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader',
					},
				]
			},
			{
				test: /.css$/,
				use: [
					{
						loader: 'style-loader'
					},
					{
						loader: 'css-loader',

						options: {
							sourceMap: true
						}
					}
				]
			}
		]
	},

	optimization: {
		minimizer: [new TerserPlugin()],

		splitChunks: {
			cacheGroups: {
				vendors: {
					priority: -10,
					test: /[\\/]node_modules[\\/]/
				}
			},

			chunks: 'async',
			minChunks: 1,
			minSize: 30000,
			name: true
		}
	}
};
