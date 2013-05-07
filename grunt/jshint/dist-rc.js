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

    // `unused` option of jshint is buggy
    // There're cases that only ocurs when overloading
    unused: true,

    sub: true,

    browser: true,
    es5: true,

    // Defining each variables with a `var` statement is more convenient for coding
    onevar: false,

    asi: false,
    lastsemic: false,

    // Report JSHint errors but not fail the task,
    // JShint is a only creature of obsessive compulsive disorder, IMO.
    force: true,

    globals: { 
    }
}
