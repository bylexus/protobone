module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jasmine: {
            customTemplate: {
                src: [
                    'dist/prototype-model.debug.js'
                ],
                options: {
                    specs: ['specs/**/*Spec.js'],
                    helpers: 'specs/**/*Helper.js',
                    vendor: [
                        "specs/prototype.js",
                    ],
                    template : require('grunt-template-jasmine-istanbul'),
                    templateOptions: {
                      coverage: 'reports/coverage.json',
                      report: 'reports/coverage'
                    }
                }
            }
        },

        uglify: {
            dist: {
                options: {
                    preserveComments: false
                },
                files: {
                    'dist/prototype-model.min.js': ['dist/prototype-model.dist.js']
                }
            }
        },

        jshint: {
            all: ['Gruntfile.js', 'src/**/*.js', 'specs/**/*.js','!specs/prototype.js']
        },

        yuidoc: {
            compile: {
                name: 'Prototype.Model',
                description: '<%= pkg.description %>',
                version: '<%= pkg.version %>',
                url: '<%= pkg.homepage %>',
                options: {
                    paths: 'src/',
                    themedir: 'docs-theme/',
                    outdir: 'docs/',
                    linkNatives: 'true'
                }
            }
        },

        browserify: {
            options: {
                browserifyOptions: {
                    standalone: 'Prototype.Model'
                }
            },
            watch: {
                options: {
                    debug: true,
                    watch: true,
                    keepAlive: true
                },
                src: 'src/main.js',
                dest: 'dist/prototype-model.debug.js'
            },
            dev: {
                options: {
                    debug: true
                },
                src: 'src/main.js',
                dest: 'dist/prototype-model.debug.js'
            },
            dist: {
                options: {
                    debug: false
                },
                src: 'src/main.js',
                dest: 'dist/prototype-model.dist.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    grunt.loadNpmTasks('grunt-browserify');

    grunt.registerTask('test', 'Run test suite using jasmine', ['browserify:dev','jasmine']);
    grunt.registerTask('build', 'Build a single bundle', ['browserify:dev','browserify:dist','uglify']);
    grunt.registerTask('doc', 'Generate API doc', ['yuidoc']);
    grunt.registerTask('default', ['test']);
};
