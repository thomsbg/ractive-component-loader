# ractive-component-loader for [webpack]

Exports a [Ractive component] as a Ractive constructor function for [webpack].


[![Status](http://img.shields.io/travis/thomsbg/ractive-component-loader/master.svg?style=flat)](https://travis-ci.org/thomsbg/ractive-component-loader "See test builds")

## Usage

[Documentation: using loaders](http://webpack.github.io/docs/using-loaders.html)

## Quick start guide

Install this into your project:

    $ npm install --save ractive-component-loader

Make all your `.html` files compile down to [Ractive] templates by
modifying your `webpack.config.js` file:

```js
/* webpack.config.js */
module.exports = {
  module: {
    loaders: [
      { test: /\.html$/, loader: 'ractive-component' }
    ]
  },
  ...
};
```

Then use your Ractive components via `require()`:

```html
<!-- mycomponent.html -->
<import rel="ractive" href="./subcomponent.html">

<div>Hello {{subject}}!</div>
<subcomponent></subcomponent>

<script>
component.exports = {
  data: { subject: 'World' }
};
</script>

<!-- subcomponent.html -->
Subcomponent are required correctly
```

```js
var Component = require('./mycomponent.html');
new Component({ el: document.body });
```

## Alternate usage

You can also use it without modifying your config. Just explicitly call it on
your `require()` call via a prefix:

```js
var Component = require('ractive-component!./mycomponent.html');
```

Thanks
------

**ractive-component-loader** © 2014+, Blake Thomson. Released under the [MIT] License.<br>
Authored and maintained by Blake Thomson with help from contributors ([list][contributors]).

[Ractive component]: https://github.com/ractivejs/component-spec
[webpack]: http://webpack.github.io/
[MIT]: http://mit-license.org/
[contributors]: http://github.com/thomsbg/ractive-component-loader/contributors
