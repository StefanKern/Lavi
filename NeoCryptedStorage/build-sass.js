var sass = require('node-sass');
var fs = require('file-system');
var tildeImporter = require('node-sass-tilde-importer');
console.log('start scss compile');

var result = sass.render({
  file: 'src/styles/application.scss',
  importer: tildeImporter,
  outputStyle: 'compressed',
  outFile: 'wwwroot/application.css',
  sourceMap: true,
  watch: true
},
  function (error, result) { // node-style callback from v3.0.0 onwards
    console.log('writting output %o', result);
    if (!error) {
      // No errors during the compilation, write this result on the disk
      fs.writeFile('wwwroot/application.css', result.css, function (err) {
        if (!err) {
          //file written on disk
        }
      });
      // No errors during the compilation, write this result on the disk
      fs.writeFile('wwwroot/application.css.map', result.map, function (err) {
        if (!err) {
          //file written on disk
        }
      });
    } else {
      console.log(error);
    }
  });

console.log('start scss compile');
