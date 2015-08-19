var assets = 'resources/assets',
    views = 'resources/views',
    out = 'public';

module.exports = {
    browser: {
        port: 4000,
        proxy: {
            host: 'localhost',
            port: 9000
        },
        reload: {
            delay: 500,
            debounce: 1000
        },
        watch: [
            [assets + '/js/**/*.js'],
            [assets + '/css/**/*.css'],
            [assets + '/less/**/*.less']
        ]
    },
    extensions: {
        fonts: '*.{otf,eot,woff,svg,ttf}',
        images: '*.{gif,png,svg,jpg,jpeg}'
    },
    filters: {
        js: ['*.js'],
        css: ['*.css'],
        font: ['*.otf', '*.eot', '*.woff', '*.woff2', '*.svg', '*.ttf'],
        image: ['*.gif', '*.png', '*.svg', '*.jpg', '*.jpeg']
    },
    inject: {
        js: views + "/layouts/_scripts.blade.php",
        css: views + "/layouts/_styles.blade.php"
    },
    paths: {
        assets: {
            root: assets,
            js: assets + '/js',
            css: assets + '/css',
            less: assets + '/less',
            fonts: assets + '/fonts',
            images: assets + '/images'
        },
        out: {
            root: out,
            js: out + '/js',
            css: out + '/css',
            fonts: out + '/fonts',
            images: out + '/images'
        },
        views: {
            root: views,
            layouts: views + '/layouts'
        }
    }
};