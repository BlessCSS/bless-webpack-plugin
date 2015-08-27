var blessPlugin = require('../lib');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	context : __dirname,
	entry : {
		small : './small.js',
		large : './large.js'
	},
	output : {
		path : __dirname + '/target',
		filename : '[name].js'
	},
	module : {
		loaders : [
			{
				test : /\.css$/,
				loader : ExtractTextPlugin.extract('css-loader')
			}
		]
	},
	plugins : [
		new ExtractTextPlugin("[name].css"),
		blessPlugin()
	]
};
