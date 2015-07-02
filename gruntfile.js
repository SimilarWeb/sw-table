module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks

    grunt.initConfig({
        sass: {
            options: {
                sourceMap: true
            },
            dist: {
                files: {
                    'dist/sw-table.css': 'src/main.scss'
                }
            }
        },

        ngtemplates: {
            'sw.table': {
                cwd: '',
                src: [
                    'src/table.html',
                    'templates/*.html'
                ],
                dest: 'src/partials.js'
            }
        },

        concat: {
            main: {
                options: {
                    banner: '\'use strict\';\n',
                    sourceMap: true
                },
                src: [
                    'src/sw-table.js',
                    'src/partials.js'
                ],
                dest: 'dist/sw-table.js'
            }
        },

        connect: {
            server: {
                options: {
                    hostname: 'localhost',
                    port: 8000,
                    open: true
                }
            }
        },

        watch: {
            options: {
                spawn: true,
                interrupt: true
            },
            html: {
                files: ['src/*.html', 'templates/*.html'],
                tasks: ['ngtemplates']
            },
            scripts: {
                files: ['src/*.js', 'development.js'],
                tasks: ['concat']
            },
            styles: {
                files: ['src/*.scss'],
                tasks: ['sass']
            }
        }
    });
    grunt.registerTask('default', ['release', 'connect', 'watch']);
    grunt.registerTask('release', ['sass', 'ngtemplates', 'concat']);
};