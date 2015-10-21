'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  defaultAssets = require('./config/assets/default'),
  testAssets = require('./config/assets/test'),
  gulp = require('gulp'),
  gulpLoadPlugins = require('gulp-load-plugins'),
  runSequence = require('run-sequence'),
  plugins = gulpLoadPlugins(),
  path = require('path');

// browserSync ############################
var browserSync = require('browser-sync');
var reload = browserSync.reload;

// watch files for changes and reload
gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: 'modules/client'
    }
  });
  gulp.watch(defaultAssets.client.views, reload) //.on('change', plugins.livereload.changed);
  gulp.watch(defaultAssets.client.js, reload) // .on('change', plugins.livereload.changed);
  gulp.watch(defaultAssets.client.css, reload) //.on('change', plugins.livereload.changed);
  
});
// end browserSync ############################


// Set NODE_ENV to 'test'
gulp.task('env:test', function () {
  process.env.NODE_ENV = 'test';
});

// Set NODE_ENV to 'development'
gulp.task('env:dev', function () {
  process.env.NODE_ENV = 'development';
});

// Set NODE_ENV to 'production'
gulp.task('env:prod', function () {
  process.env.NODE_ENV = 'production';
});

// Nodemon task
gulp.task('nodemon', function () {
  return plugins.nodemon({
    script: 'server.js',
    nodeArgs: ['--debug'],
    ext: 'js,html',
    watch: _.union(defaultAssets.server.views, defaultAssets.server.allJS, defaultAssets.server.config)
  });
});

// Watch Files For Changes
gulp.task('watch', ['browser-sync'], function() {
  // Start livereload
  //plugins.livereload.listen();

  //gulp.watch(['*.html', 'css/*.css', 'js/*.js'], {cwd: 'modules'}, reload).on('change', plugins.livereload.changed)

  // Add watch rules
  // gulp.watch(defaultAssets.server.gulpConfig);
  // gulp.watch(defaultAssets.server.views).on('change', plugins.livereload.changed);
  // gulp.watch(defaultAssets.server.allJS)//.on('change', plugins.livereload.changed);
  gulp.watch(defaultAssets.client.views).on('change', plugins.livereload.changed);
  gulp.watch(defaultAssets.client.js, reload) // .on('change', plugins.livereload.changed);
  gulp.watch(defaultAssets.client.css, reload) //.on('change', plugins.livereload.changed);
  // gulp.watch(defaultAssets.client.sass, ['sass', 'csslint']).on('change', plugins.livereload.changed);
  // gulp.watch(defaultAssets.client.less, ['less', 'csslint']).on('change', plugins.livereload.changed);
});

// // CSS linting task
// gulp.task('csslint', function (done) {
//   return gulp.src(defaultAssets.client.css)
//     .pipe(plugins.csslint('.csslintrc'))
//     .pipe(plugins.csslint.reporter())
//     .pipe(plugins.csslint.reporter(function (file) {
//       if (!file.csslint.errorCount) {
//         done();
//       }
//     }));
// });

// // JS linting task
// gulp.task('jshint', function () {
//   return gulp.src(_.union(defaultAssets.server.gulpConfig, defaultAssets.server.allJS, defaultAssets.client.js, testAssets.tests.server, testAssets.tests.client, testAssets.tests.e2e))
//     .pipe(plugins.jshint())
//     .pipe(plugins.jshint.reporter('default'))
//     .pipe(plugins.jshint.reporter('fail'));
// });


// // JS minifying task
// gulp.task('uglify', function () {
//   return gulp.src(defaultAssets.client.js)
//     .pipe(plugins.ngAnnotate())
//     .pipe(plugins.uglify({
//       mangle: false
//     }))
//     .pipe(plugins.concat('application.min.js'))
//     .pipe(gulp.dest('public/dist'));
// });

// // CSS minifying task
// gulp.task('cssmin', function () {
//   return gulp.src(defaultAssets.client.css)
//     .pipe(plugins.cssmin())
//     .pipe(plugins.concat('application.min.css'))
//     .pipe(gulp.dest('public/dist'));
// });

// // Sass task
// gulp.task('sass', function () {
//   return gulp.src(defaultAssets.client.sass)
//     .pipe(plugins.sass())
//     .pipe(plugins.rename(function (file) {
//       file.dirname = file.dirname.replace(path.sep + 'scss', path.sep + 'css');
//     }))
//     .pipe(gulp.dest('./modules/'));
// });

// // Less task
// gulp.task('less', function () {
//   return gulp.src(defaultAssets.client.less)
//     .pipe(plugins.less())
//     .pipe(plugins.rename(function (file) {
//       file.dirname = file.dirname.replace(path.sep + 'less', path.sep + 'css');
//     }))
//     .pipe(gulp.dest('./modules/'));
// });

// // Mocha tests task
// gulp.task('mocha', function (done) {
//   // Open mongoose connections
//   var mongoose = require('./config/lib/mongoose.js');
//   var error;

//   // Connect mongoose
//   mongoose.connect(function() {
//     // Run the tests
//     gulp.src(testAssets.tests.server)
//       .pipe(plugins.mocha({
//         reporter: 'spec'
//       }))
//       .on('error', function (err) {
//         // If an error occurs, save it
//         error = err;
//       })
//       .on('end', function() {
//         // When the tests are done, disconnect mongoose and pass the error state back to gulp
//         mongoose.disconnect(function() {
//           done(error);
//         });
//       });
//   });

// });

// Karma test runner task
gulp.task('karma', function (done) {
  return gulp.src([])
    .pipe(plugins.karma({
      configFile: 'karma.conf.js',
      action: 'run',
      singleRun: true
    }));
});

// Selenium standalone WebDriver update task
gulp.task('webdriver-update', plugins.protractor.webdriver_update);

// Protractor test runner task
gulp.task('protractor', function () {
  gulp.src([])
    .pipe(plugins.protractor.protractor({
      configFile: 'protractor.conf.js'
    }))
    .on('error', function (e) {
      throw e;
    });
});

// Lint CSS and JavaScript files.
gulp.task('lint', function(done) {
  runSequence('less', 'sass', ['csslint', 'jshint'], done);
});

// Lint project files and minify them into two production files.
gulp.task('build', function(done) {
  runSequence('env:dev' ,'lint', ['uglify', 'cssmin'], done);
});

// Run the project tests
gulp.task('test', function(done) {
  runSequence('env:test', ['karma', 'mocha'], done);
});

// Run the project in development mode
gulp.task('default', function(done) {
  runSequence('env:dev', 'lint', ['nodemon', 'watch'], done);
});

// Run the project in debug mode
gulp.task('debug', function(done) {
  runSequence('env:dev', 'lint', ['nodemon', 'watch'], done);
});

// Run the project in production mode
gulp.task('prod', function(done) {
  runSequence('build', 'env:prod', 'lint', ['nodemon', 'watch'], done);
});
