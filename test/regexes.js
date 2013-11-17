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
            match = patterns.stylus.exec(matches);

        matches.match(patterns.stylus).should.have.length(9);

        while (match) {
            match[1].should.match(/foo|\.\/foo|foo_bar-test\.suf/);
            match = patterns.stylus.exec(matches);
        }
    });
    it('ignores incorrect imports', function () {
        var matches =
            'import "foo"\n' +
            '@ import foo\n' +
            '@include "foo"\n' +
            '$import "foo"\n';
        should.not.exist(matches.match(patterns.stylus));
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
            match = patterns.commonjs.exec(matches);

        matches.match(patterns.commonjs).should.have.length(7);

        while (match) {
            match[1].should.match(/\.\/foo|foo_bar-test\.suf/);
            match = patterns.commonjs.exec(matches);
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
        should.not.exist(matches.match(patterns.commonjs));
    });
});