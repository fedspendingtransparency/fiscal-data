const {series, parallel, gulp} = require('gulp');

// The `clean` function is not exported so it can be considered a private task.
// It can still be used within the `series()` composition.
function clean(cb) {
  // body omitted
  cb();
}

// The `build` function is exported so it is public and can be run with the `gulp` command.
// It can also be used within the `series()` composition.
function build(cb) {
  console.log('hello');

  return gulp.src('*/gulp/*.html')
    .pipe(gulp.dest(''))

  // body omitted
  //cb();
}

// gulp.task('html', function() {
//   return gulp.src('src/gulp/*.html')
//     .pipe(gulp.dest(''))
// });

exports.build = build;
exports.default = series(clean, build); // series() forces tasks to execute in a particular order. Use parallel() to run at maximum concurrency


