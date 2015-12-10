Plugin for webpack that runs [bless](http://blesscss.com/) over all (generated) css files.

## Installation

Install the plugin with npm:

```bash
$ npm install --save-dev bless-webpack-plugin
```

## Usage
```javascript
var blessPlugin = require('bless-webpack-plugin');

{
	plugins : [
		blessPlugin();
	]
}
```

## API
### `blessPlugin([blessOptions[, pattern[, outputFilename]]])`

- `blessOptions` is an options object for bless. It will be passed directly to it.
- `pattern` a regular expression to find assets that should be transformed with bless. Default: `/\.css$/`.
- `outputFilename` a filename for the blessed css files. If set, the original (unblessed) files will also be emitted. The following variables can be used:
  - `[filebase]` The base name of the asset, without path or extension
  - `[file]` The full name of the asset, including path and extension
