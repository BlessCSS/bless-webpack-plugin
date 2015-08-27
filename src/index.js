import { chunk } from 'bless';
import { basename, extname } from 'path';
import RawSource from 'webpack/lib/RawSource';

/**
 * Generates a filename for a chunk based on the filename from the source and the index of the chunk.
 */
function generateFileName(sourceFileName, chunkIndex) {
	const ext = extname(sourceFileName);
	const base = basename(sourceFileName, ext);
	return `${base}-blessed${chunkIndex}${ext}`;
}

/**
 * Generate import statements that import additional chunks.
 */
function generateImports(sourceFileName, numberOfImports) {
	return Array.from(new Array(numberOfImports), (x, i) => i + 1)
		.map(index => generateFileName(sourceFileName, index))
		.map(file => `@import url('${file}');`)
		.join('\n');
}

/**
 * Creates an array of chunk objects from an object returned by bless.chunk
 */
function createFileChunks(sourceFileName, blessed) {
	return blessed.data.map((chunk, index) => {
		let name;
		if (index === blessed.data.length - 1) {
			name = sourceFileName;
			const imports = generateImports(sourceFileName, blessed.data.length - 1) ;
			chunk = `${imports}\n${chunk}`;
		} else {
			name = generateFileName(sourceFileName, index + 1);
		}
		return { name, chunk, map : blessed.maps[index] };
	});
}

export default function(options, pattern) {
	pattern = pattern || /\.css$/;
	options = options || {};

	return {
		apply(compiler) {
			compiler.plugin('this-compilation', compilation => {
				compilation.plugin('optimize-assets', (assets, callback) => {

					Object.keys(assets)
						.filter(assetName => pattern.test(assetName))
						.map(fileName => [fileName, assets[fileName].source()])
						.map(([fileName, source]) => [fileName, chunk(source, options)])
						.map(([fileName, blessed]) => createFileChunks(fileName, blessed))
						.reduce((a, b) => [...a, ...b]) //flatten
						.forEach(({ name, chunk }) => assets[name] = new RawSource(chunk));

					callback();
				});
			});
		}
	};
}
