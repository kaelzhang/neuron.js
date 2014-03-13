# Changelog

- 4.1.0: Adds a new distribution file without the polyfill of ECMAScript5.
- 4.0.0: Changes APIs. loader -> neuron. Removed `config.ns`.
- 3.7.0: Completely refractored path calculation and fixes the problem that `require.async` might load a wrong module.
- 3.6.0: Adds a new config `ext` to define the file extension of the package file.
- 3.5.0: Supports `require.async` and adds a new option `options.asyncDeps` for method `define`.
- 3.3.0: Supports ranges of package version
- 3.2.0: Adds a new config `preload` for the mode of passive module loading. Explode private method `._load` for testing.
- 3.1.0: Completely refractored. Supports semantic versions.