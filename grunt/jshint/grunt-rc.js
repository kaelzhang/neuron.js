module.exports = {
    boss: true,
    curly: true,
    eqeqeq: true,
    eqnull: true,
    expr: true,
    immed: true,
    noarg: true,

    // Never force string to quoting with single or double quotemarks
    quotmark: false,
    smarttabs: true,
    undef: true,
    unused: true,

    sub: true,

    browser: true,

    // Defining each variables with a `var` statement is more convenient for coding
    onevar: false,

    asi: false,
    lastsemic: false,

    // Report JSHint errors but not fail the task
    // force: true,

    // allow global "use strict"
    globalstrict: true,

    globals: {
        require: true,
        process: true,
        module: true,
        exports: true
    }
}
