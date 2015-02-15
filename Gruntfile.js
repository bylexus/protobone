module.exports = function(grunt) {
  grunt.initConfig({
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
          ]
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
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('test', 'Run test suite using jasmine', ['jasmine']);
  grunt.registerTask('default', ['test']);
};
