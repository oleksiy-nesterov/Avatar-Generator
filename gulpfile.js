let
gulp       = require('gulp'),
eslint     = require('gulp-eslint'),
concat     = require('gulp-concat'),
uglify     = require('gulp-uglify'),
sourcemaps = require('gulp-sourcemaps'),
postcss    = require('gulp-postcss'),
prefixer   = require('autoprefixer')({browsers:['last 3 version'], remove:false}),
csswring   = require('csswring')({removeAllComments: true}),

js         = ['www/js/avatar.js'],
css        = ['www/css/avatar.css'];

gulp.task('build.js', function(){
    return gulp.src(js)
    .pipe(sourcemaps.init())
    .pipe(concat('avatar.min.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('www/js/'));
});

gulp.task('build.css', function(){
    return gulp.src(css)
    .pipe(sourcemaps.init())
    .pipe(concat('avatar.min.css'))
    .pipe(postcss([prefixer, csswring]))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('www/css/'));
});

gulp.task('default', ['build.js', 'build.css'], function(){
    gulp.watch(css, ['build.css']);
    gulp.watch(js, ['build.js']);
    gulp.watch(js).on('change', function(file){
        gulp.src(file.path)
        .pipe(eslint({
            rules: {
                'no-alert'             : 1,
                'no-unused-vars'       : [1, {args:'none'}],
                'no-undef'             : 2
            },
            globals: [
                'AudioFX',
                'Avatar',
                'cordova'
            ],
            envs: [
                'browser'
            ]
        }))
        .pipe(eslint.format('table'));
    })
});