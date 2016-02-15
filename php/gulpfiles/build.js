var gulp = require("gulp");
var sequence = require('run-sequence');       // Run gulp tasks in sequence
var config = require('../gulpconfig');        // Load config file for paths and module exports
var plugins = require('gulp-load-plugins')(); // Load all gulp-* plugins ('gulp-' stripped)
var es = require('event-stream');             // Construct pipes of streams of events
var del = require('del');                     // Delete files/folders

var prod = !!plugins.util.env.production;     // Whether production parameter was used (bool)

/*----------  Build Assets  ----------*/
gulp.task('build', ['install'], function(cb) {
  sequence('clean', 'bower', ['sass', 'scripts', 'fonts', 'images'], ['inject'], cb);
});

/*----------  Auto install npm/bower packages  ----------*/
gulp.task('install', function() {
  return gulp.src(['./bower.json', './package.json'])
    .pipe(plugins.install()); // Run gulp-install
});

/*----------  Clean public asset directories  ----------*/
gulp.task('clean', function() {
  // Clear out files from the following output directories
  return del([
    config.paths.out.js,
    config.paths.out.css,
    config.paths.out.fonts,
    config.paths.out.images
  ]);
});

/*----------  Compile SASS  ----------*/
gulp.task('sass', function() {
  // Error handler for Plumber
  var handleError = function(err) {
    // Notify an error linting SASS. For example, syntax errors in sass which would cause task failure
    plugins.notify.onError({
      title: 'Error Linting SASS',
      subtitle: '',
      message: err.message,
      sound: ''
    })(err);
    this.emit('end'); // When using Watch, this signals to end the errored task, otherwise the task hangs
  };

  return gulp.src(config.paths.assets.sass + '/app.scss')
    .pipe(plugins.plumber({
      errorHandler: handleError
    })) // Prevent pipe breaking caused by errors from gulp plugins
    .pipe(plugins.sass())           // Compile SASS
    .pipe(plugins.autoprefixer())   // Add prefixes
    .pipe(prod ? plugins.cssnano() : plugins.util.noop()) // Minify SASS, if Production
    .pipe(prod ? plugins.rename({
      suffix: '.min'
    }) : plugins.util.noop())   // Add the .min suffix, if Production
    .pipe(gulp.dest(config.paths.out.css)); // Output to destination
});

/*----------  Concatenate Scripts  ----------*/
gulp.task('scripts', function() {
  return gulp.src("resources/assets/js/*.js")
    .pipe(plugins.concat('main.js'))   // Concatenates javascript files
    .pipe(prod ? plugins.uglify() : plugins.util.noop()) // Minify Javascript, if Production
    .pipe(prod ? plugins.rename({
      suffix: '.min'
    }) : plugins.util.noop())   // Add the .min suffix, if Production
    .pipe(gulp.dest(config.paths.out.js));  // Output to destination
});

/*----------  Output Fonts  ----------*/
gulp.task('fonts', function() {
  return gulp.src(config.paths.assets.fonts + "/**/" + config.extensions.fonts)
    .pipe(gulp.dest(config.paths.out.fonts));
});

/*----------  Output Images  ----------*/
gulp.task('images', function() {
  return gulp.src(config.paths.assets.images + "/**/" + config.extensions.images)
    .pipe(gulp.dest(config.paths.out.images));
});

/*----------  Inject Styles/Scripts  ----------*/
gulp.task('inject', function() {
  // Merge streams to allow performing operations on multiple gulp sources for different files
  return es.merge(
    // Inject js into partial (i.e., _scripts)
    gulp.src(config.inject.js)
    .pipe(plugins.inject(
      gulp.src(config.paths.out.js + '/**/*.js', {
        read: false
      }), {
        ignorePath: config.paths.out.root
      }))
    .pipe(gulp.dest(config.paths.views.layouts)),

    // Inject css into partial (i.e., _styles)
    gulp.src(config.inject.css)
    .pipe(plugins.inject(
      gulp.src(config.paths.out.css + '/**/*.css', {
        read: false
      }), {
        ignorePath: config.paths.out.root
      }))
    .pipe(gulp.dest(config.paths.views.layouts))
  );
});
