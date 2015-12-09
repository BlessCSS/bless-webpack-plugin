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
### `blessPlugin(sourceMaps = false)`



