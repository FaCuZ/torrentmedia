/**
 * Node.js Module Build
 *
 * @author potanin@UD
 * @version 0.0.2
 * @param grunt
 */
module.exports = function( grunt ) {

  // Automatically load tasks with package name "grunt-*" included in package.json.
  require( 'load-grunt-tasks' )( grunt );
  
  grunt.initConfig({

    pkg: grunt.file.readJSON( 'package.json' ),

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: {
        src: ['Gruntfile.js', 'lib/**/*.js']
      }
    },

    clean: {
      docs: {
        src: 'docs/'
      },
      coverage: {
        src: 'lib-cov/'
      },
      reports: {
        src: 'reports/'
      }
    },

    // Tests.
    copy: {
      test: {
        src: ['test/**'],
        dest: 'lib-cov/'
      }
    },

    blanket: {
      all: {
        src: 'lib/',
        dest: 'lib-cov/lib'
      }
    },

    mochaTest: {
        options: {
            require: [ 'should' ],
            reporter: 'list',
            ui: 'exports'

        },
        
      ci: {
        options: {
          reporter: 'spec',
          timeout: 10000,
          ui: 'exports',
          require: [ 'should' ]
        },
        src: 'static/tests/*.js'
      },
      
      'html-cov': {
        options: {
          reporter: 'html-cov',
          quiet: true,
          captureFile: 'static/reports/coverage.html'
        },
        src: ['static/lib-cov/test/lib/**/*.js']
      },
      
      'mocha-lcov-reporter': {
        options: {
          reporter: 'mocha-lcov-reporter',
          quiet: true,
          captureFile: 'static/reports/lcov.info'
        },
        src: ['static/lib-cov/test/lib/**/*.js']
      },
      
      'travis-cov': {
        options: {
          reporter: 'travis-cov'
        },
        src: ['static/lib-cov/test/lib/**/*.js']
      }
    },

    coveralls: {
      options: {
        force: true
      },
      all: {
        src: 'reports/lcov.info'
      }
    },

    yuidoc: {
      compile: {
        name: '<%= pkg.name %>',
        description: '<%= pkg.description %>',
        version: '<%= pkg.version %>',
        url: '<%= pkg.homepage %>',
        logo: 'http://media.usabilitydynamics.com/logo.png',
        options: {
          paths: [ "./lib" ],
          outdir: './static/codex'
        }
      }
    },


    watch: {
      options: {
        interval: 1000,
        debounceDelay: 500
      },
      docs: {
        files: [ 'readme.md' ],
        tasks: [ 'markdown' ]
      }
    },

    markdown: {
      all: {
        files: [ {
          expand: true,
          src: 'readme.md',
          dest: 'static/',
          ext: '.html'
        }
        ],
        options: {
          // preCompile: function preCompile( src, context ) {},
          // postCompile: function postCompile( src, context ) {},
          templateContext: {},
          markdownOptions: {
            gfm: true,
            codeLines: {
              before: '<span>',
              after: '</span>'
            }
          }
        }
      }
    },

    shell: {
      install: {},
      update: {}
    }

  });

  // Build Assets
  grunt.registerTask( 'default', [ 'mochaTest', 'markdown', 'yuidoc' ] );

  // Install environment
  grunt.registerTask( 'install', [ 'shell:pull', 'shell:install', 'yuidoc'  ] );

  // Update Environment
  grunt.registerTask( 'update', [ 'shell:pull', 'shell:update', 'yuidoc'   ] );

  // Prepare distribution
  grunt.registerTask( 'dist', [ 'clean', 'yuidoc', 'markdown'  ] );

  // Update Documentation
  grunt.registerTask( 'doc', [ 'yuidoc', 'markdown' ] );

  // Run Tests
  grunt.registerTask( 'test', [ 'mochaTest:ci' ] );

  // Developer Mode
  grunt.registerTask( 'dev', [ 'watch' ] );

};