var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

gulp.task('default', function() {

});

gulp.task('serve', function() {
  browserSync({
    server: {
      // baseDir: 'app'
    }
  });

  gulp.watch(['*.html', 'app/pages/**/*.html', 'app/styles/**/*.css', 'app/scripts/**/*.js', ], {}, reload);
});
