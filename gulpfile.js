var gulp = require('gulp');
var args = require('yargs').argv;
var $ = require('gulp-load-plugins')({lazy: true});
var port = process.env.PORT || 9000;
var path = require('path');
var del = require('del');

/**
 *
 *  General Tasks
 *
 */
gulp.task('help', $.taskListing);

gulp.task('default', ['help']);

gulp.task('clean', function (done) {
    clean('./tmp');
    clean('./server/public/assets/*', done);
});

/**
 *
 *  JS Style and Linting Tasks
 *
 */
gulp.task('code-style', function () {
    return gulp.src(['./lib/**/*.js', '!./lib/**/*.spec.js', './gulpfile.js'])
        .pipe($.jscs());
});

gulp.task('jshint', function () {
    return gulp.src('./lib/**/*.js')
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish', {verbose: true}))
        .pipe($.jshint.reporter('fail'));
});

gulp.task('vet', ['code-style', 'jshint']);

/**
 *
 *  Sass build tasks
 *
 */
gulp.task('compile-sass', ['clean'], function () {
    return gulp.src('./lib/**/*.scss')
        .pipe($.sass({outputStyle: 'compressed'}))
        .pipe(gulp.dest('./tmp/lib'));
});

gulp.task('concat-css', ['compile-sass'], function () {
    return gulp.src('./tmp/**/*.css')
        .pipe($.concatCss('webapi.css'))
        .pipe(gulp.dest('./tmp/build/'));
});

gulp.task('minify-css', ['concat-css'], function () {
    return gulp.src('./tmp/build/webapi.css')
        .pipe($.minifyCss({keepBreaks: true}))
        .pipe(gulp.dest('./server/public/assets/'));
});

/**
 *
 *  Local development tasks
 *
 */
gulp.task('start', function () {
    var bunyan = require('bunyan');
    var child_process = require('child_process');

    var nodeOptions = {
        script: './server/index.js',
        stdout: false,
        delayTime: 1,
        env: {
            PORT: port,
            NODE_ENV: 'vagrant'
        },
        watch: ['./lib', './server', 'gulpfile.js']
    };

    return $.nodemon(nodeOptions)
        .on('readable', function (evt) {
            var bunyan = child_process.spawn('node', [path.join(__dirname, './node_modules/bunyan/bin/bunyan')], {stdio: ['pipe', process.stdout, process.stderr]});
            this.stdout.pipe(bunyan.stdin);
            this.stderr.pipe(bunyan.stdin);
        })
        .on('restart', ['vet'], function (evt) {
            log('*** Server restarted ***');
            log('*** files changed on restart: \n' + evt);
        })
        .on('start', ['vet'], function () {
            log('*** Server started ***');
        })
        .on('crash', function (evt) {
            log('*** Server crashed ***');
        })
        .on('exit', function () {
            log('*** Server exited ***');
        });
});

gulp.task('test', function () {
    return gulp.src('./lib/**/*.spec.js')
        .pipe($.jasmine())
        .pipe($.jasmine.reporter('jasmine-reporters'))
        .pipe($.jasmine.reporter('fail'));
});

/**
 *
 *  util functions
 *
 */
function log (msg) {
    if (typeof(msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}

function clean (path, done) {
    log('Cleaning: ' + $.util.colors.blue(path));
    del(path, done);
}
