import gulp from "gulp";
import gulpSass from "gulp-sass";
import dartSass from "sass";
import autoprefixer from "gulp-autoprefixer";
import cleanCSS from "gulp-clean-css";
import terser from "gulp-terser";
import imagemin, { gifsicle, mozjpeg, optipng, svgo } from "gulp-imagemin";
import imagewebp from "gulp-webp";
import browserSync from "browser-sync";

const { src, dest, watch, series } = gulp;
const sass = gulpSass(dartSass);
const bs = browserSync.create();

//compile, prefix, and min sass
function compilesass() {
  return src("src/sass/*.sass") //source directory
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer("last 2 versions"))
    .pipe(cleanCSS())
    .pipe(dest("dist/css")) //final/public directory
    .pipe(bs.stream());
}

//optimize and move images
function optimizeimg() {
  return src("src/images/*.{jpg,png,jpeg,gif,svg}") //source directory
    .pipe(
      imagemin([
        gifsicle({ interlaced: true }),
        mozjpeg({ quality: 75, progressive: true }),
        optipng({ optimizationLevel: 5 }),
        svgo({
          plugins: [
            {
              name: "removeViewBox",
              active: true,
            },
            {
              name: "cleanupIDs",
              active: false,
            },
          ],
        }),
      ])
    )
    .pipe(dest("dist/images")); //final/public directory
}

// function optimizeimg() {
//   return src('src/images/*.{jpg,png}') // change to your source directory
//     .pipe(imagemin([
//       mozjpeg({ quality: 80, progressive: true }),
//       optipng({ optimizationLevel: 2 }),
//     ]))
//     .pipe(dest('dist/images')) // change to your final/public directory
// };

//optimize and move images
function webpImage() {
  return src('dist/images/*.{jpg,png}') // change to your source directory
    .pipe(imagewebp())
    .pipe(dest('dist/images')) // change to your final/public directory
};

// minify js
function jsmin() {
  return src("src/js/*.js") // source directory
    .pipe(terser())
    .pipe(dest("dist/js")) //final/public directory
    .pipe(bs.stream());
}

//watchtask
function watchTask() {
  bs.init({
    server: {
      baseDir: './'
    }
  });
  watch("src/sass/**/*.sass", compilesass); //source directory
  watch("src/js/*.js", jsmin); //source directory
  watch("src/images/*", optimizeimg); //source directory
  watch("dist/images/*.{jpg,png}", webpImage); //source directory
  watch('*.html').on('change', bs.reload);// Watch and reload HTML files

}

// Default Gulp task
export default series(compilesass, jsmin, optimizeimg, webpImage, watchTask);
