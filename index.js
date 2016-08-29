'use strict'
var rcu = require('rcu');
var Ractive = require('ractive');
var CleanCSS = require('clean-css');
var toSource = require('tosource');

rcu.init(Ractive);

module.exports = function (source) {
	this.cacheable();

	var isPartial = /\/_.*\.ract/.test(this.request)

	var definition = rcu.parse(source);

	var templateSource = toSource(definition.template, null, '')
	if (isPartial) {
		return 'module.exports = ' + templateSource + ';\n'
	}
	return '' +
		"var Ractive = require('ractive');\n" +
		'var component = module;\n' +
		( definition.script ?
		definition.script + '\n' : '' ) +
		'component.exports.template = ' + templateSource + ';\n' +
		( definition.css ?
		'component.exports.css = ' + JSON.stringify(new CleanCSS().minify(definition.css).styles) + ';\n' : '' ) +
		( definition.imports.length ?
		'component.exports.components = {' + definition.imports.map(getImportKeyValuePair).join(', ') + '};\n' : '' ) +
		'module.exports = Ractive.extend(component.exports);\n';
};

function getImportKeyValuePair(imported, i) {
	return stringify(imported.name) + ": require('" + imported.href + "')";
}

function stringify(key) {
	if (/^[a-zA-Z$_][a-zA-Z$_0-9]*$/.test(key)) {
		return key;
	}

	return JSON.stringify(key);
}
