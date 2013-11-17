var walk = require('walkdir'),
    fs = require('fs'),
    path = require('path');

var patterns = {
    stylus: /@import[\s\t]*[\(]?[\s\t]*['"]?([a-zA-Z0-9*\/\.\-\_]*)[\s\t]*[\n;\s'")]?/g,
    commonjs: /require[\t\s]*\([\t\s]*["']{1}([\.]{1,2}\/.*)(\.js)?["'][\t\s]*\)/g
};

function removeExtension (filename) {
    var parts = filename.split('.');
    parts.pop();
    return parts.join('.');
}

function getDir (filename) {
    var parts = filename.split('/');
    parts.pop();
    return parts.join('/');
}

function getDirectDependencies (file, root, importExp) {
    var imports = [],
        match = importExp.exec(file.content);

    while (match) {
        imports.push(path.relative(root, path.resolve(root, file.dir, match[1])));
        match = importExp.exec(file.content);
    }

    return imports || [];
}

function getDependentsRec (target, tree, root, importExp) {
    var out = [],
        directDependencies;

    for (var name in tree) {
        directDependencies = getDirectDependencies(tree[name], root, importExp);
        if (directDependencies.indexOf(target) !== -1) {
            out.push(tree[name].filename);
            out = out.concat(getDependentsRec(name, tree, root, importExp));
        }
    }

    return out;
}

function getModuleName (filepath, root) {
    return removeExtension(path.relative(root, filepath));
}

function removeDuplicates (arr) {
    var out = [];

    for (var i = 0; i < arr.length; i += 1) {
        if (out.indexOf(out[i]) === -1) {
            out.push(arr[i]);
        }
    }

    return out;
}

function findDependantsSync (filepath, root, importExp, match) {
    var targetStats = walk.sync(root, { 'return_object': true }),
        tree = {},
        targetName = getModuleName(filepath, root),
        filename, name;

    for (filename in targetStats) {
        if (targetStats.hasOwnProperty(filename)) {
            if (!targetStats[filename].isDirectory() && (!match || match.test(filename))) {
                name = getModuleName(filename, root);
                tree[name] = {
                    content: fs.readFileSync(filename, 'utf8'),
                    filename: filename,
                    dir: getDir(name)
                };
            }
        }
    }

    return removeDuplicates(getDependentsRec(targetName, tree, root, importExp));
}

module.exports = { patterns: patterns, findSync: findDependantsSync };