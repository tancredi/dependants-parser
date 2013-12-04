/* global describe, it */

var should = require('should');

var patterns = require('../index').patterns;

describe('Stylus regex', function () {
    it('matches basic imports', function () {
        var matches =
            '@import "foo"\n' +
            '@import("foo")\n' +
            '@import(\'foo\')\n' +
            '@import(\'foo_bar-test.suf\')\n' +
            '@import( "foo" )\n' +
            '@import( "./foo" )\n' +
            '@import foo\n' +
            '@import  foo;\n' +
            '@import    (  foo    )',
            match = patterns.stylus.exp.exec(matches);

        should.exist(match);
        matches.match(patterns.stylus.exp).should.have.length(9);

        while (match) {
            match[1 + patterns.stylus.offset].should.match(/foo|\.\/foo|foo_bar-test\.suf/);
            match = patterns.stylus.exp.exec(matches);
        }
    });
    it('ignores incorrect imports', function () {
        var matches =
            'import "foo"\n' +
            '@ import foo\n' +
            '@include "foo"\n' +
            '$import "foo"\n';
        should.not.exist(matches.match(patterns.stylus.exp));
    });
});

describe('CommonJS regex', function () {
    it('matches basic imports', function () {
        var matches =
            'require(\'./foo\')\n' +
            'require("../foo")\n' +
            'require    ("./foo_bar-test.suf")\n' +
            'require( "./foo" )\n' +
            'require    (  "./foo"    )\n' +
            'require    (  "../foo"    )\n' +
            'require("./foo.js")\n',
            match = patterns.commonjs.exp.exec(matches);

        should.exist(match);
        matches.match(patterns.commonjs.exp).should.have.length(7);

        while (match) {
            match[1 + patterns.commonjs.offset].should.match(/\.\/foo|foo_bar-test\.suf/);
            match = patterns.commonjs.exp.exec(matches);
        }
    });
    it('ignores incorrect imports', function () {
        var matches =
            'require(' +
            'require( "foo" )' +
            'require    (  "foo"    )' +
            'require    (  "foo"    )' +
            'require    (  foo    )' +
            'require    (  foo"    )' +
            'require    (  ./foo"    )' +
            'require    (  ".../foo"    )' +
            'require    (  ".foo"    )';
        should.not.exist(matches.match(patterns.commonjs.exp));
    });
});

describe('Jade regex', function () {
    it('matches basic imports', function () {
        var matches =
            'include foo\n' +
            'include   foo/bar\n' +
            ': include   ./foo/bar\n' +
            'include          foo-bar\n' +
            'extends foo\n' +
            'extends last',
            match = patterns.jade.exp.exec(matches);

        should.exist(match);
        matches.match(patterns.jade.exp).should.have.length(6);

        while (match) {
            match[1 + patterns.jade.offset].should.match(/(\.\/)?foo|foo_bar|(\.\/)?foo\/bar|last/);
            match = patterns.jade.exp.exec(matches);
        }
    });
    it('ignores incorrect imports', function () {
        var matches =
            'include      "foo"\n' +
            'include \'foo\'\n' +
            '@include foo"\n' +
            'import  foo   \n' +
            'require  foo    )\n' +
            'include     "\n' +
            'include/foo   !\n' +
            'fds include foo\n' +
            'extend foo\n';
        should.not.exist(matches.match(patterns.jade.exp));
    });
});