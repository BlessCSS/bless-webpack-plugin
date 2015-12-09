import { chunk } from 'bless';
import { basename, extname, resolve } from 'path';
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
function createChunks(fileName, source, sourcemaps, context) {
	const sourceFileName = fileName.replace(/\.css$/, '.source.css');
	const options = {
		sourcemaps,
		source : sourceFileName
	};
	const blessed = chunk(source, options);

	const chunks = blessed.data.map((chunk, index) => {
		let name;
		if (index === blessed.data.length - 1) {
			name = fileName;
			const imports = generateImports(fileName, blessed.data.length - 1) ;
			chunk = `${imports}\n${chunk}`;
		} else {
			name = generateFileName(fileName, index + 1);
		}
		if (sourcemaps) {
			chunk += `\n/*# sourceMappingURL=${name}.map */`;
		}
		return { name, content: chunk, map : blessed.maps[index] };
	});

	if (sourcemaps) {
		chunks.push({
			name : sourceFileName,
			content : source
		});
	}

	return chunks;
}

export default function(sourceMaps = false) {

	return {
		apply(compiler) {
			compiler.plugin('this-compilation', compilation => {
				compilation.plugin('optimize-assets', (assets, callback) => {

					Object.keys(assets)
						.filter(assetName => /\.css$/.test(assetName))
						.map(fileName => [fileName, assets[fileName].source()])
						.map(([fileName, source]) => createChunks(fileName, source, sourceMaps))
						.reduce((a, b) => [...a, ...b]) //flatten
						.forEach(({ name, content, map }) => {
							assets[name] = new RawSource(content);
							if (map) {
								assets[`${name}.map`] = new RawSource(JSON.stringify(map));
							}
						});

					callback();
				});
			});
		}
	};
}
