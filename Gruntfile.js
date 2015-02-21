module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jasmine: {
            customTemplate: {
                src: [
                    'src/Prototype.Model.js',
                    'src/Prototype.Model.sync.js'
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
                    'dist/prototype-model.min.js': ['src/Prototype.Model.js', 'src/Prototype.Model.sync.js']
                }
            },
            distDebug: {
                options: {
                    mangle: false,
                    compress: false,
                    sourceMap: true,
                    preserveComments: 'all',
                    beautify: true
                },
                files: {
                    'dist/prototype-model.debug.js': ['src/Prototype.Model.js', 'src/Prototype.Model.sync.js']
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
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');

    grunt.registerTask('test', 'Run test suite using jasmine', ['jasmine']);
    grunt.registerTask('build', 'Build a single bundle', ['uglify']);
    grunt.registerTask('doc', 'Generate API doc', ['yuidoc']);
    grunt.registerTask('default', ['test']);
};