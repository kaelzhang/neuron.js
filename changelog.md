# Changelog


When version <= 5.0.0, all applications are under complete control by us, so the increasement of versions goes a little fast.

### 6.x

- 6.0.0: [#102][102] Better versioning. No dependency mediation, unlike Maven. Removes both `config.ranges` and `config.depTree`, and merge them into `config.tree`.

### 5.x

- 5.1.0: Supports `require.resolve`; Supports to facade an entry; Prohibits to load a module id with version.
- 5.0.0: <del>4.5.0:</del> Factory functions now only executes when `require()`d. Updates major version that it might affected circular dependencies. Fixes circular dependencies, #83 - #85.

### 4.x

- 4.4.0: Removes support for configurations on script node.
- 4.3.0: `require` method will throw an error if module is not found.
- 4.2.0: Supports dynamic combo(#66). Refractors inner logic and reduces total size. `require.async` will no longer accept array as the first argument.
- 4.1.0: Adds a new distribution file without the polyfill of ECMAScript5.
- 4.0.0: Changes APIs. loader -> neuron. Removed `config.ns`.

### 3.x

- 3.7.0: Completely refractored path calculation and fixes the problem that `require.async` might load a wrong module.
- 3.6.0: Adds a new config `ext` to define the file extension of the package file.
- 3.5.0: Supports `require.async` and adds a new option `options.asyncDeps` for method `define`.
- 3.3.0: Supports ranges of package version
- 3.2.0: Adds a new config `preload` for the mode of passive module loading. Explode private method `._load` for testing.
- 3.1.0: Completely refractored. Supports semantic versions.

## Former

Oh, the changes are too old to track :p

[102]: https://github.com/kaelzhang/neuron/issues/102
