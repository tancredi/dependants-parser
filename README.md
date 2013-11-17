# dependants-parser

> Utility to recursively fetch dependant modules by parsing require syntaxes targeting a specified local module using a given a root directory and an import expression regex.

## The problem

While writing a custom watch-build tool I needed some quick and dirty way to figure out which modules depended on the  file that changed would be emitted to in order to avoid re-compiling every file in the codebase at every change.

This tool is easily extensible to work with most pre-processors & syntaxes as long as their import command can be expressed with a regular expression and the modules are located relatively to the target file.

By now Stylus and CommonJS regexes are available by default in this module.

## Install

```
npm install dependants-parser
```

## Test

Test with Mocha by running

```
npm test
```

## Simple usage

Considering the following tree:

```
.
├── index.js
└── stylus
    ├── root.styl
    └── target.styl
```

stylus/root.styl:

```
@import 'target.styl'
```

index.js:

```
var dependants = require('dependants-tree');

var out = dependants.findSync(
	'./stylus/target.styl',		// Target dependency
	'./stylus',					// Modules root
	dependants.patterns.stylus	// Import expression regex
	);

console.log(out);
// [ 'abs/path/to/stylus/root.styl' ]
```

## Exports

####`.findSync([ filepath ], [ root ], [ importRegex ], [ match ])`

Returns an array containing absolute paths of all modules that depend on `filepath` found in `root`, given an import expression syntax.

* `[ filepath ]` - Path to target module. This needs to be the real filename.
* `[ root ]` - Directory to recursively scan for dependants.
* `[ importRegex ]` - Import syntax expression. Used to parse out a file's dependency.
* `[ match ]` - Filename match expression. Use to filter files to scan.

### `.patterns`

Contains simple ready-to-use regexes for local import syntaxes

* `stylus` - @import 'module` syntax for Stylus
* `commonjs` - @import 'module` syntax for CommonJS requires

## Contribute

It would be great to provide import syntaxes for other languages / pre-processors (LESS, SASS, SCSS, Jade, Handlebars) this module could be used for.

Please feel free to drop a pull request if you're using this module with a custom expressions or improving the current ones / writing more tests.

Regexes are tested in `test/regexes.js`.