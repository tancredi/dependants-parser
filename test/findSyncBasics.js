/* global describe, it */

require('should');

var dependantTree = require('../index'),
    path = require('path');

var importPattern = { exp: /import (.*)/g, offset: 0 },
    offsetImportPattern = { exp: /(i)(m)port (.*)/g, offset: 2 };

describe('.findSync', function () {
    it('all files are returned when called without match pattern', function () {
        var dependants = dependantTree.findSync(
            'test/basics/target.ext',
            'test/basics',
            importPattern
            );

        dependants.should.have.length(3);
        dependants.should.include(path.resolve('test/basics/root.ext'));
        dependants.should.include(path.resolve('test/basics/ignore.me'));
        dependants.should.include(path.resolve('test/basics/sub/sub-root.ext'));
    });
    it('only matching files are returned when called with match pattern', function () {
        var match = /(.*).ext/,
            dependants = dependantTree.findSync(
                'test/basics/target.ext',
                'test/basics',
                importPattern,
                match
                );

        dependants.should.have.length(2);
        dependants.should.include(path.resolve('test/basics/root.ext'));
        dependants.should.include(path.resolve('test/basics/sub/sub-root.ext'));
    });
    it('returns correct filenames when using an offset pattern', function () {
        var match = /(.*).ext/,
            dependants = dependantTree.findSync(
                'test/basics/target.ext',
                'test/basics',
                offsetImportPattern,
                match
                );

        dependants.should.have.length(2);
        dependants.should.include(path.resolve('test/basics/root.ext'));
        dependants.should.include(path.resolve('test/basics/sub/sub-root.ext'));
    });
    it('converts given pattern regex into object with offset 0 when not specified', function () {
        var match = /(.*).ext/,
            dependants = dependantTree.findSync(
                'test/basics/target.ext',
                'test/basics',
                importPattern.exp,
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
            importPattern
            );

        dependants.should.have.length(1);
        dependants.should.include(path.resolve('test/basics/sub/sub-root.ext'));
    });
    it('will find modules relatively in a parallel root', function () {
        var dependants = dependantTree.findSync(
            'test/basics/parallel/target.ext',
            'test/basics/sub',
            importPattern
            );

        dependants.should.have.length(1);
        dependants.should.include(path.resolve('test/basics/sub/parallel-root.ext'));
    });
    it('will throw when called on and unexisting root', function () {
        (function () {
            dependantTree.findSync(
                'test/basics/parallel/target.ext',
                'test/basics/I_dont_exist',
                importPattern
                );
        }).should.throw();
    });
});