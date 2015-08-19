var gulp = require("gulp");
var config = require('../gulpconfig');          // Load config file for paths and module exports
var plugins = require('gulp-load-plugins')();   // Load all gulp-* plugins ('gulp-' stripped)
var bowerFiles = require('main-bower-files');   // Get main files from bower packages

var prod = !!plugins.util.env.production;     // Whether production parameter was used (bool)

/*----------  Bower Dependencies  ----------*/
gulp.task('bower', function() {
    // Work on a subset of files using filtering, and allow restoring to original file stream
    var jsFilter = plugins.filter(config.filters.js, {restore:true});
    var cssFilter = plugins.filter(config.filters.css, {restore:true});
    var fontFilter = plugins.filter(config.filters.font, {restore:true});
    var imageFilter = plugins.filter(config.filters.image, {restore:true});

    // Stream the main files from installed bower packages
    return gulp.src(bowerFiles())
        // Bower JS Files
        .pipe(jsFilter)                                                     // Filter for JS
        .pipe(plugins.concat('lib.js'))                                     // Concatenate JS
        .pipe(prod ? plugins.uglify() : plugins.util.noop())                // Minify JS, if Production
        .pipe(prod ? plugins.rename({suffix:'.min'}) : plugins.util.noop()) // Add .min suffix, if Production
        .pipe(gulp.dest(config.paths.out.js))                               // Output to Destination
        .pipe(jsFilter.restore)                                             // Restore to unfiltered file stream

        // Bower CSS Files
        .pipe(cssFilter)
        .pipe(plugins.concat('lib.css'))
        .pipe(prod ? plugins.minifyCss() : plugins.util.noop())
        .pipe(prod ? plugins.rename({suffix:'.min'}) : plugins.util.noop())
        .pipe(gulp.dest(config.paths.out.css))
        .pipe(cssFilter.restore)

        // Bower Font Files
        .pipe(fontFilter)
        .pipe(plugins.flatten())    // Replace relative paths to absolute
        .pipe(gulp.dest(config.paths.out.fonts))
        .pipe(fontFilter.restore)

        // Bower Image Files
        .pipe(imageFilter)
        .pipe(plugins.flatten())
        .pipe(gulp.dest(config.paths.out.images))
        .pipe(imageFilter.restore);
});