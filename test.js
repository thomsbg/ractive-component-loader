/* jshint evil: true */

var loader, cached, obj = {};
var assert = require('chai').assert;
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

    it('returns the result of Ractive.extend()', function() {
      var m = eval("var module={ exports: {} };"+out+";module;");
      assert.isFunction(m.exports);
      assert.equal(Object.getPrototypeOf(m.exports.prototype), Ractive.prototype);
    });

    it('contains the words', function () {
      assert.include(out, "hello");
      assert.include(out, "world");
    });
  });

  describe('sub-components', function() {
    beforeEach(function() {
      out = loader.apply(obj, ['<link rel="ractive" name="test" href="./test.html"/>']);
    });

    it('requires sub-components', function() {
      assert.include(out, "components = {test: require('./test.html')}");
    });
  });

  describe('styles', function() {
    beforeEach(function() {
      out = loader.apply(obj, ['<style>div { color: red; }</style>']);
    });

    it('minifies inline styles', function() {
      assert.include(out, 'exports.css = "div{color:red}";');
    });
  });

  describe('script', function() {
    beforeEach(function() {
      out = loader.apply(obj, ['<script>component.exports = { test: true };</script>']);
    });

    it('inserts inline script before setting the template', function() {
      var m = eval("var module={ exports: {} };"+out+";module;");
      assert.property(m.exports.prototype, 'test');
      assert.property(m.exports.prototype, 'template');
    });
  });
});
