var bless = require('bless');
var RawSource = require('webpack/lib/RawSource');
var _ = require('lodash');

module.exports = function(options, pattern) {
	pattern = pattern || /\.css$/;
	options = options || {};

	return {
		apply: function(compiler) {
			compiler.plugin("this-compilation", function(compilation) {
				compilation.plugin("optimize-assets", function(assets, callback) {
					var pending = 0;

					function done(err) {
						pending--;
						if (err && pending >= 0) {
							pending = 0;
							callback(err);
						} else if (pending === 0) {
							callback();
						}
					}

					Object.keys(assets)
						.filter(pattern.test.bind(pattern))
						.forEach(function(name) {
							pending++;
							new bless.Parser({ output: name, options : options })
								.parse(assets[name].source(), function(err, files) {
									if (err) {
										done(err);
										return;
									}
									delete assets[name];
									files.forEach(function(file) {
										assets[file.filename] = new RawSource(file.content);
									});
									done();
								});
						});

				});
			});
		}
	};
};
