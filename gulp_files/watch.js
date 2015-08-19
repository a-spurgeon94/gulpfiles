/* ----- Requirements & Variables ----- */
var gulp = require("gulp");
var browserSync = require("browser-sync").create();     // Create an instance of Browser-Sync
var config = require('../gulpconfig.js');               // Load config properties
var $ = require('gulp-load-plugins')();                 // Load all gulp-* plugins

/* ----- Browser-Sync Proxy ----- */
gulp.task('browser-sync', function () {
    // Initialize the browser-sync instance
    browserSync.init(config.browser.watch, {
        port: config.browser.port,      // Port for desired browser-sync access
        proxy: config.browser.proxy.host + ':' + config.browser.proxy.port,   // proxy the server (ex, localhost:8000)
        reloadDelay: config.browser.reload.delay,   // Delay between reloads following a change
        reloadDebounce: config.browser.reload.debounce // Restrict reload event frequency
    });
});

/* ----- Watch Files ----- */
gulp.task('watch', function () {
    // Watch our desired assets for changes, and reload the page
    gulp.watch(config.paths.assets.js + "/**/*.js", ['scripts']).on('change', browserSync.reload);
    gulp.watch(config.paths.assets.less + "/**/*.less", ['less']).on('change', browserSync.reload);
    gulp.watch(config.paths.views.root + "/**/*.php").on('change', browserSync.reload);
});