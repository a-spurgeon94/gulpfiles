var gulp = require('gulp');
var sequence = require('run-sequence');     // Run gulp tasks in sequence
require('require-dir')('./gulpfiles');     // Require all gulp files in directory

/*----------  Start Gulp  ----------*/
gulp.task('default', function(cb) {
    // Build assets, setup browser-sync, then watch files
    sequence('build', 'browser-sync', 'watch', cb);  // Needs callback or return for stream
});