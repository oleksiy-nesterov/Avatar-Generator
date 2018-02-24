let
gulp       = require('gulp'),
eslint     = require('gulp-eslint'),
concat     = require('gulp-concat'),
uglify     = require('gulp-uglify'),
sourcemaps = require('gulp-sourcemaps'),
postcss    = require('gulp-postcss'),
zip        = require('gulp-zip'),
intercept  = require('gulp-intercept'),
phonegap   = require('phonegap-build-api'),
prefixer   = require('autoprefixer')({browsers:['last 3 version'], remove:false}),
csswring   = require('csswring')({removeAllComments: true}),
js         = ['www/js/avatar.js'],
css        = ['www/css/avatar.css'],

log = function(str){
    const bar = (new Array(str.length + 2)).fill('═').join('');
    console.log('');
    console.log('\x1b[32m', '╔'  + bar  + '╗');
    console.log('\x1b[32m', '║ ' + '\x1b[37m' + str + '\x1b[32m' + ' ║');
    console.log('\x1b[32m', '╚'  + bar  + '╝');
    console.log('\x1b[0m', '');
};

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

let
config     = require('./config.json'),
build      = ['www/**', '!www/css/avatar.css', '!www/js/avatar.js', '!www/cover.jpg', '!www/favicon.*', '!www/*.yaml', '!**/*.map'],
zipName    = 'build-' + config.version + '.zip';

gulp.task('phonegap.build', function(){
    // gulp build.phonegap --devApp
    // gulp build.phonegap --prodApp
    let params = process.argv.slice(3).map(v => v.replace(/^--/, ''));
    let app = config.phonegap[params[0] || 'devApp'];
    
    return gulp.src(build, {base:'www', nodir: true})
    .pipe(intercept(function(file){
        if(/www\\config.xml$/.test(file.path)){
            let body = file.contents.toString().replace(/\{\{version\}\}/, config.version);
            file.contents = new Buffer(body);
        };
        return file;
    }))
    .pipe(zip(zipName))
    .pipe(gulp.dest('tmp'))
    .on('end', function(){
        log(zipName + ' is ready to be uploaded.');
        phonegap.auth({username:app.user, password:app.pass}, function(e, api){
            if(e){
                console.log('error:', e);
            }else if(api){
                log('The Phonegap Build authorisation was completed successfully. Uploading had started.');
                let options = {form:{data:{debug:false, keys:app.keys}, file:'tmp/' + zipName}};
                api && api.put('/apps/' + app.id, options, function(e, data){
                    e && console.log('error:', e);
                    if(data){
                        log('Congratulations! ' + data.title + ' ' + data.version + ' binary in progress!');
                        //console.log('data:', data);
                    }
                });
            }
        });
    })
});