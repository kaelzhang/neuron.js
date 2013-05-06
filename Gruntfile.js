'use strict';


module.exports = function( grunt ) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        build: {
            all: {
                dest: "dist/neuron.js",
                src: [
                    "lib/snippet/intro.js",
                    "lib/ecma5.js",
                    
                    "lib/seed.js",
                    "lib/snippet/common.js",
                    
                    "lib/event.js",
                    "lib/loader/core.js",
                    "lib/biz.js",
                    "lib/snippet/outro.js"
                    // { flag: "sizzle", src: "src/selector-sizzle.js", alt: "src/selector-native.js" }
                ]
            }
        }
    });


    grunt.registerMultiTask(
        'build',
        'build files',
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