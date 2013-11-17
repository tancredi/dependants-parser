/* global describe, it */

require('should');

var dependantTree = require('../index'),
    path = require('path');

var importExpression = /require[\s\t]{0,}\([\s\t]{0,}['|"]([\.].*)['|"][\s|\t]{0,}\)/g;

describe('.findSync CommonJS', function () {
    it('returns no dependants of an anused module', function () {
        var dependants = dependantTree.findSync(
            'test/commonjs/stand-alone.js',
            'test/commonjs',
            importExpression
            );

        dependants.should.have.length(0);
    });
    it('returns dependants of a direct child', function () {
        var dependants = dependantTree.findSync(
            'test/commonjs/a.js',
            'test/commonjs',
            importExpression
            );

        dependants.should.have.length(1);
        dependants.should.include(path.resolve('test/commonjs/root.js'));
    });
    it('returns dependants of a secondary child', function () {
        var dependants = dependantTree.findSync(
            'test/commonjs/b.js',
            'test/commonjs',
            importExpression
            );

        dependants.should.have.length(2);
        dependants.should.include(path.resolve('test/commonjs/a.js'));
        dependants.should.include(path.resolve('test/commonjs/root.js'));
    });
    it('returns dependants from different roots', function () {
        var dependants = dependantTree.findSync(
            'test/commonjs/c.js',
            'test/commonjs',
            importExpression
            );

        dependants.should.have.length(4);
        dependants.should.include(path.resolve('test/commonjs/a.js'));
        dependants.should.include(path.resolve('test/commonjs/b.js'));
        dependants.should.include(path.resolve('test/commonjs/root.js'));
        dependants.should.include(path.resolve('test/commonjs/root-c.js'));
    });
    it('solves dependants ascending subdirectories', function () {
        var dependants = dependantTree.findSync(
            'test/commonjs/sub/a.js',
            'test/commonjs',
            importExpression
            );

        dependants.should.have.length(1);
        dependants.should.include(path.resolve('test/commonjs/root-sub.js'));
    });
});