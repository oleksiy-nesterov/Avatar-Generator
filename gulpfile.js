let
gulp       = require('gulp'),
eslint     = require('gulp-eslint');

gulp.task('default', function(){
    gulp.watch(['www/js/*.js']).on('change', function(file){
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