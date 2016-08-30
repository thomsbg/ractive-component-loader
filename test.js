/* jshint evil: true */

var loader, cached, obj = {};
var assert = require('chai').assert;
var expect = require('chai').expect;
var Ractive = require('ractive');

before(function () {
	loader = require('./index');
});

describe('ractive-loader', function () {
	obj.cacheable = function () {
		cached = true;
	};

	beforeEach(function () {
		cached = false;
	});

	it('loads properly', function () {
		/* pass */
	});

	describe('a simple template', function () {
		beforeEach(function () {
			out = loader.apply(obj, ['hello {{world}}']);
		});

		it('sets the cacheable flag', function () {
			assert(cached);
		});

		it('assigns to module.exports', function () {
			assert.match(out, /module\.exports =/);
		});

		it('is terminated by a semicolon', function () {
			assert.match(out, /;\s+$/);
		});

		it('returns the result of Ractive.extend()', function () {
			var m = eval("var module={ exports: {} };" + out + ";module;");
			assert.isFunction(m.exports);
			assert.equal(Object.getPrototypeOf(m.exports.prototype), Ractive.prototype);
		});

		it('contains the words', function () {
			assert.include(out, "hello");
			assert.include(out, "world");
		});
	});

	describe('sub-components', function () {
		beforeEach(function () {
			out = loader.apply(obj, ['<link rel="ractive" name="test" href="./test.html"/>']);
		});

		it('requires sub-components', function () {
			assert.include(out, "components = {test: require('./test.html')}");
		});
	});

	describe('styles', function () {
		beforeEach(function () {
			out = loader.apply(obj, ['<style>div { color: red; }</style>']);
		});

		it('minifies inline styles', function () {
			assert.include(out, 'exports.css = "div{color:red}";');
		});
	});

	describe('script', function () {
		beforeEach(function () {
			out = loader.apply(obj, ['<script>component.exports = { test: true };</script>']);
		});

		it('inserts inline script before setting the template', function () {
			var m = eval("var module={ exports: {} };" + out + ";module;");
			assert.property(m.exports.prototype, 'test');
			assert.property(m.exports.prototype, 'template');
		});
	});

	describe('underscore partials', function () {
		var scenarios = [
			{path: 'component.ract', isPartial: false},
			{path: '_component.ract', isPartial: true},
			{path: '/somedir/component.ract', isPartial: false},
			{path: '/somedir/_component.ract', isPartial: true},
			{
				path: '/home/evan/dev/pyramid-admin/client/node_modules/babel-loader/index.js?{"presets":["es2015"]}!/home/evan/dev/ractive-component-loader/index.js!/home/evan/dev/pyramid-admin/client/tmp/webpack_filter-input_base_path-OftnbARW.tmp/0/views/partials/_messages.ract',
				isPartial: true
			},
			{
				path: '/home/evan/dev/pyramid-admin/client/node_modules/babel-loader/index.js?{"presets":["es2015"]}!/home/evan/dev/ractive-component-loader/index.js!/home/evan/dev/pyramid-admin/client/tmp/webpack_filter-input_base_path-OftnbARW.tmp/0/views/components/mainMenu.ract',
				isPartial: false
			},
			{
				path: '/home/evan/dev/pyramid-admin/_meta/_clienttmp/src/views/components/mainMenu.ract',
				isPartial: false
			},
			{path: '/home/evan/dev/pyramid-admin/_meta/_clienttmp/src/views/partials/_menu.ract', isPartial: true}
		]

		scenarios.forEach(function (scenario) {
			"use strict";
			it('detects "' + scenario.path + '" as a ' + (scenario.isPartial ? 'partial' : 'component'), function () {
				obj.request = scenario.path
				let out
				try {
					out = loader.apply(obj, ['<div></div>']);
				} finally {
					delete obj.request
				}
				let treatedAsComponent = out.indexOf('Ractive.extend') != -1
				expect(treatedAsComponent).to.equal(!scenario.isPartial)
			})
		})
	})
})

