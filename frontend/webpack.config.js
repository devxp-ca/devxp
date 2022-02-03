/* eslint no-undef: "off" */

const path = require("path");
const fs = require("fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");

// App directory
const appDirectory = fs.realpathSync(process.cwd());

// Gets absolute path of file within app directory
const resolveAppPath = relativePath => path.resolve(appDirectory, relativePath);

// Required for babel-preset-react-app
process.env.NODE_ENV = "development";

module.exports = {
	entry: path.join(__dirname, "src", "index.tsx"),
	output: {
		path: path.resolve(__dirname, "dist")
	},
	resolve: {
		modules: [
			path.resolve(__dirname, "src"),
			path.resolve(__dirname, "node_modules")
		],
		extensions: [".tsx", ".ts", ".js"]
	},
	devServer: {
		historyApiFallback: true,
		static: {
			directory: path.join(__dirname, "public")
		},
		compress: true,
		port: 9000
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: "ts-loader",
				exclude: /node_modules/
			},
			{
				test: /\.?js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-env", "@babel/preset-react"]
					}
				}
			},
			{
				test: /\.css$/i,
				use: ["style-loader", "css-loader"]
			},
			{
				test: /\.(png|jp(e*)g|svg|gif)$/,
				use: ["file-loader"]
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			inject: true,
			template: resolveAppPath("public/index.html")
		})
	]
};
