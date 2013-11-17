/* global describe, it */

require('should');

var dependantTree = require('../index'),
    path = require('path');

var importExpression = /import (.*)/g;

describe('.findSync', function () {
    it('all files are returned when called without match pattern', function () {
        var dependants = dependantTree.findSync(
            'test/basics/target.ext',
            'test/basics',
            importExpression
            );

        dependants.should.have.length(3);
        dependants.should.include(path.resolve('test/basics/root.ext'));
        dependants.should.include(path.resolve('test/basics/ignore.me'));
        dependants.should.include(path.resolve('test/basics/sub/sub-root.ext'));
    });
    it('all files are returned when called without match pattern', function () {
        var match = /(.*).ext/,
            dependants = dependantTree.findSync(
                'test/basics/target.ext',
                'test/basics',
                importExpression,
                match
                );

        dependants.should.have.length(2);
        dependants.should.include(path.resolve('test/basics/root.ext'));
        dependants.should.include(path.resolve('test/basics/sub/sub-root.ext'));
    });
    it('only considers files in the specified root maintaining relativity to the target', function () {
        var dependants = dependantTree.findSync(
            'test/basics/target.ext',
            'test/basics/sub',
            importExpression
            );

        dependants.should.have.length(1);
        dependants.should.include(path.resolve('test/basics/sub/sub-root.ext'));
    });
    it('will find modules relatively in a parallel root', function () {
        var dependants = dependantTree.findSync(
            'test/basics/parallel/target.ext',
            'test/basics/sub',
            importExpression
            );

        dependants.should.have.length(1);
        dependants.should.include(path.resolve('test/basics/sub/parallel-root.ext'));
    });
    it('will throw when called on and unexisting root', function () {
        (function () {
            dependantTree.findSync(
                'test/basics/parallel/target.ext',
                'test/basics/I_dont_exist',
                importExpression
                );
        }).should.throw();
    });
});