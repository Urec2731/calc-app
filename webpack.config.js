const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const ExtractCssPluginConfig = new ExtractTextPlugin({
	filename: "styles.css",
	disable: false,
	allChunks: true
});
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
	template: './src/index.html',
	filename: 'index.html',
	inject: 'body',
	favicon: 'src/assets/favicon.ico'
});


webpackConfig = {
    context: __dirname,
    entry: {
        bundle: './src/index.js',
        styles: './src/main.scss'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'build')
    },
	resolve: {
		extensions: ['.js', '.jsx'],
		modules: [
			path.join(__dirname, "src"),
			"node_modules"
		]
	},
    devtool: '#cheap-module-source-map',
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.scss$/,
				use: ExtractTextPlugin.extract({
						fallback: "style-loader",
						use: [
							"css-loader",
							"resolve-url-loader",
							{
								loader: "sass-loader",
								options: "sourceMap"
							}
						]
					})
			},
            {
                test: /\.css$/,
				use: ExtractTextPlugin.extract({
						fallback: "style-loader",
						use: "css-loader"
					})
            },
            {
				test: /\.(gif|png|ico|jpg|jpeg\ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
				use: 'file-loader'
            }
        ]
    },
    plugins: [
        ExtractCssPluginConfig,
		HtmlWebpackPluginConfig
    ]
};
module.exports = webpackConfig;
