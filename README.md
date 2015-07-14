Plugin for webpack that runs [bless](http://blesscss.com/) over all (generated) css files.

## Usage:
```javascript
var blessPlugin = require('bless-webpack-plugin');

{
	plugins : [
		blessPlugin();
	]
}
```

## API
### `blessPlugin([blessOptions[, pattern]])`

- `blessOptions` is an options object for bless. It will be passed directly to it.
- `pattern` a regular expression to find assets that should be transformed with bless. Default: `/\.css$/`.



