'use strict';


module.exports = function( grunt ) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        build: {
            all: {
                dest: "dist/neuron.js",
                src: [
                    "lib/snippet/intro.js",

                    "lib/seed.js",

                    "lib/snippet/common.js",

                    "lib/lang/native.js",
                    "lib/lang/type.js",
                    "lib/lang/enhance.js",
                    "lib/lang/web.js",

                    "lib/event.js",

                    "lib/loader/module-manager.js",
                    "lib/loader/assets.js",

                    "lib/ua.js",
                    "lib/biz.js",

                    "lib/snippet/outro.js"
                    // { flag: "sizzle", src: "src/selector-sizzle.js", alt: "src/selector-native.js" }
                ]
            }
        }
    });


    grunt.registerMultiTask(
        'build',
        'blah-blah',
        function() {
            var version = grunt.config( "pkg.version" );
            var data = this.data;
            var src = data.src;
            var dest = data.dest;
            var compiled;

            if ( process.env.COMMIT ) {
                version += "" + process.env.COMMIT;
            }

            compiled = src.reduce(function(compiled, filepath) {
                return compiled + grunt.file.read( filepath ) + '\n\n';

            }, '');


            // Embed Version
            // Embed Date
            compiled = compiled
                .replace( /@VERSION/g, version )
                .replace( "@DATE", function () {
                    // YYYY-MM-DD
                    return ( new Date() ).toISOString().replace( /T.*/, "" );
                });

            // Write concatenated source to file
            grunt.file.write( dest, compiled );

            // Fail task if errors were logged.
            if ( this.errorCount ) {
                return false;
            }

            // Otherwise, print a success message.
            grunt.log.writeln( "File '" + dest + "' created." );
        }

    );


    grunt.registerTask('default', ['build']);


};