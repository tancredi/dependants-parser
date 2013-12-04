/* global describe, it */

require('should');

var dependantTree = require('../index'),
    path = require('path');

var importPattern = dependantTree.patterns.stylus;

describe('.findSync Stylus', function () {
    it('returns no dependants of an anused module', function () {
        var dependants = dependantTree.findSync(
            'test/stylus/stand-alone.styl',
            'test/stylus',
            importPattern
            );

        dependants.should.have.length(0);
    });
    it('returns dependants of a direct child', function () {
        var dependants = dependantTree.findSync(
            'test/stylus/direct-child.styl',
            'test/stylus',
            importPattern
            );

        dependants.should.have.length(1);
        dependants[0].should.equal(path.resolve('test/stylus/main-root.styl'));
    });
    it('returns dependants of a secondary child', function () {
        var dependants = dependantTree.findSync(
            'test/stylus/second-child.styl',
            'test/stylus',
            importPattern
            );

        dependants.should.have.length(2);
        dependants.should.include(path.resolve('test/stylus/main-root.styl'));
        dependants.should.include(path.resolve('test/stylus/direct-child.styl'));
    });
    it('returns dependants from different roots', function () {
        var dependants = dependantTree.findSync(
            'test/stylus/child-dead-branch.styl',
            'test/stylus',
            importPattern
            );

        dependants.should.have.length(3);
        dependants.should.include(path.resolve('test/stylus/alt-root.styl'));
        dependants.should.include(path.resolve('test/stylus/direct-child.styl'));
        dependants.should.include(path.resolve('test/stylus/main-root.styl'));
    });
    it('solves dependants descending subdirectories', function () {
        var dependants = dependantTree.findSync(
            'test/stylus/child-of-sub-root.styl',
            'test/stylus',
            importPattern
            );

        dependants.should.have.length(1);
        dependants.should.include(path.resolve('test/stylus/sub/sub-root.styl'));
    });
    it('solves dependants ascending from subdirectories', function () {
        var dependants = dependantTree.findSync(
            'test/stylus/sub/child-subdir.styl',
            'test/stylus',
            importPattern
            );

        dependants.should.have.length(4);
        dependants.should.include(path.resolve('test/stylus/sub/sub-root.styl'));
        dependants.should.include(path.resolve('test/stylus/second-child.styl'));
        dependants.should.include(path.resolve('test/stylus/direct-child.styl'));
        dependants.should.include(path.resolve('test/stylus/main-root.styl'));
    });
    it('ascends from several subs to solve dependants', function () {
        var dependants = dependantTree.findSync(
            'test/stylus/sub/sub/sub/child-remote.styl',
            'test/stylus',
            importPattern
            );

        dependants.should.have.length(1);
        dependants.should.include(path.resolve('test/stylus/root-of-remote.styl'));
    });
});