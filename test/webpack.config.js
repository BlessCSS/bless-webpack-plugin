var blessPlugin = require('../lib');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	context : __dirname,
	entry : {
		test : './index.js'
	},
	output : {
		path : __dirname + '/target',
		filename : 'out.js'
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
