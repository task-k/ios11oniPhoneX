'use strict';

var gulp = require('gulp'); //gulp本体

var modules = require('gulp-load-plugins')();//package.json内のgulp-*で始まるプラグインの自動読み込み
var postcss = require('postcss');//cssのPluginハンドリング用ベースライブラリ
var autoprefixer = require('autoprefixer');// cssのベンダープレフィックスの自動付与

var uglify = require('gulp-uglify');//圧縮 Licenseコメント残すオプションを使用するための宣言

var browserSync = require('browser-sync').create();//livereloadしたいのでconnectから移行
var connectSSI = require('connect-ssi');//localhostserverのssi拡張


/**
 * gulp の引数をオブジェクトにする
 */
const arg = (argList => {
  let arg = {}, a, opt, thisOpt, curOpt;
  for (a = 0; a < argList.length; a++) {
    thisOpt = argList[a].trim();
    opt = thisOpt.replace(/^\-+/, '');
    if (opt === thisOpt) {
      // argument value
      if (curOpt) arg[curOpt] = opt;
      curOpt = null;
    }
    else {
      // argument name
      curOpt = opt;
      arg[curOpt] = true;
    }
  }
  return arg;
})(process.argv);

var argumentPath = arg.uniquePath || arg.up;
var baseDir = __dirname;
var uniquePath = argumentPath ? argumentPath.replace(new RegExp(baseDir,'g'),''): '';

/**
 * gulp local server
 * 主にjs挙動やレイアウト確認の為に使用
 * gulp localでrun
 * defaltでは起動しない
 */
gulp.task('server', function() {
  // var baseDir = __dirname + '/htdocs';
  browserSync.init({
    notify: false,
    startPath: uniquePath + '/index.html',// cmsで書き出されたhtmlファイルがないのでincludeが完了するページ
    logLevel: "silent",
    port: 7575,
    server: {
      baseDir: baseDir,
      middleware: [
        connectSSI({
          baseDir: baseDir,
          ext: '.html'
        })
      ]
    },
    ui: {
      port: 7576
    }
  });
});
/**
 * Browser　リロード
 */
gulp.task('reload', function () {
    browserSync.reload();
});


gulp.task('styles', function () {
  return gulp.src('assets/scss/**/*.scss')
    .pipe(modules.sassGlob())
    .pipe(modules.sourcemaps.init())
    .pipe(modules.sass({outputStyle: 'compressed'}).on('error', modules.sass.logError))
    .pipe(modules.postcss([
        autoprefixer()// browserslistはpackage.json内に移動
    ]))
    .pipe(modules.sourcemaps.write('./'))
    .pipe(gulp.dest('assets/css'));
});

/**
 * script 結合圧縮
 */
gulp.task('scripts', function() {
  return gulp.src([
    'assets/js/**/*.js',
    '!assets/js/main.js' //書出したjsは除外
  ])
    // .pipe(modules.sourcemaps.init())
    .pipe(modules.concat('main.js'))
    .pipe(uglify({preserveComments: 'some'}))
    // .pipe(modules.sourcemaps.write(''))
    .pipe(gulp.dest('assets/js'))
});

/**
 * loacl検証時のサーバー起動
 */
gulp.task('local', ['server'], function() {
  gulp.watch('./**/*.html', ['reload']);
  gulp.watch('assets/scss/**/*.scss', ['styles', 'reload']);
  gulp.watch('assets/js/**/*.js', ['scripts','reload']);
});
/**
 * dafault task
 */
gulp.task('default', function(){
  gulp.watch('src/**/*.scss', ['styles']);
  gulp.watch('src/**/*.js', ['scripts'])
});
