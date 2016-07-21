module.exports = function(grunt) {
  grunt.initConfig({
    copy: {
      js: {
        src: [
          'node_modules/three/build/three.js',
          'bower_components/spectrum/spectrum.js',
          'bower_components/jquery/dist/jquery.min.js'
        ],
        dest: 'js',
        flatten: true,
        expand: true
      },
      shaders: {
        src: ['node_modules/three/examples/js/shaders/**.js'],
        dest: 'js/shaders',
        flatten: true,
        expand: true
      },
      postprocessing: {
        src: ['node_modules/three/examples/js/postprocessing/**.js'],
        dest: 'js/postprocessing',
        flatten: true,
        expand: true
      },
      css: {
        src: [
          'bower_components/spectrum/spectrum.css',
          'src/terminal/terminal.css',
          'src/colorpicker/colorpicker.css'
        ],
        dest: 'css',
        flatten: true,
        expand: true
      }
    },
    shell: {
      build: {
        command: 'npm run build'
      },
      open: {
        command: 'open index.html'
      },
      test: {
        command: 'npm run test'
      }
    },
    watch: {
      css: {
        files: 'src/**/*.css',
        tasks: ['copy:css']
      }
    },
    concurrent: {
      dev: {
        tasks: ['shell:build', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', ['copy', 'shell:test', 'shell:open', 'concurrent:dev'])
};
