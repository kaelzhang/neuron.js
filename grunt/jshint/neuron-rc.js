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
    es5: true,

    // Defining each variables with a `var` statement is more convenient for coding
    onevar: false,

    asi: false,
    lastsemic: false,

    // Report JSHint errors but not fail the task
    force: true,



    globals: {
        require: true,
        module: true,
        exports: true,
        define: true
    }
}
