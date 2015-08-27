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
### `blessPlugin(sourceMaps = false)`



