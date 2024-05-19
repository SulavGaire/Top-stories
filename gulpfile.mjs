import gulp from "gulp";
import gulpSass from "gulp-sass";
import dartSass from "sass";
import autoprefixer from "gulp-autoprefixer";
import cleanCSS from "gulp-clean-css";
import terser from "gulp-terser";
import cache from "gulp-cache";
import imagemin, { gifsicle, mozjpeg, optipng, svgo } from "gulp-imagemin";
import imagewebp from "gulp-webp";
import browserSync from "browser-sync";

const { src, dest, watch, series } = gulp;
const sass = gulpSass(dartSass);
const bs = browserSync.create();

// Compile, prefix, and minify Sass
function compilesass() {
  return src("src/sass/*.sass")
    .pipe(sass().on("error", sass.logError))
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 2 versions"],
        cascade: false,
      })
    )
    .pipe(cleanCSS())
    .pipe(dest("dist/css"))
    .pipe(bs.stream());
}

// Clear cache task
function clearCache(done) {
  return cache.clearAll(done);
}

// Optimize and move images
function optimizeimg() {
  return src("src/images/*.{png,jpg,jpeg,gif,svg}")
    .pipe(
      cache(
        imagemin([
          gifsicle({ interlaced: true }),
          mozjpeg({ quality: 75, progressive: true }),
          optipng({ optimizationLevel: 5 }),
          svgo({
            plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
          }),
        ])
      )
    )
    .pipe(dest("dist/images"))
    .on("end", () => console.log("Images optimized and moved."));
}

// Convert images to WebP format
function webpImage() {
  return src("dist/images/*.{jpg,png}")
    .pipe(imagewebp())
    .pipe(dest("dist/images"));
}

// Minify JavaScript
function jsmin() {
  return src("src/js/*.js")
    .pipe(terser())
    .pipe(dest("dist/js"))
    .pipe(bs.stream());
}

// Watch task
function watchTask() {
  bs.init({
    server: {
      baseDir: "./",
    },
  });
  watch("src/sass/**/*.sass", compilesass);
  watch("src/js/*.js", jsmin);
  watch("src/images/*", optimizeimg);
  watch("dist/images/*.{jpg,png}", webpImage);
  watch("*.html").on("change", bs.reload);
}

export default series(
  clearCache,
  compilesass,
  jsmin,
  optimizeimg,
  webpImage,
  watchTask
);
export { clearCache, compilesass, jsmin, optimizeimg, webpImage, watchTask };
