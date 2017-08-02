require('dotenv').config();
var gulp = require('gulp');
var fs = require('fs');
var path = require('path');
var run = require('gulp-run');

gulp.task('gitupdate', ['gitinit'], function () {
  return run('git submodule update').exec();
});

gulp.task('gitinit', function () {
  return run('git submodule init').exec();
});

// update generator
gulp.task('updategenerator', ['gitupdate'], function () {

  var env = process.env;
  var dir = process.cwd();
 
  //var gulpRanInThisFolder = process.cwd();
  var sourcefolder = path.join(dir, 'submodules/botboiler');  
  var destinationfolder = path.join(dir, '/generators/app/templates/');

  if(!fs.existsSync(sourcefolder)){
    console.log(`Folder not found: ${sourcefolder}`);
    return;
  }

  if(!fs.existsSync(destinationfolder)){
    console.log(`Folder not found: ${destinationfolder}`);
    return;
  }
 
 console.log(`Source: ${sourcefolder} Dest: ${destinationfolder}`);

  var srcsource = path.join(sourcefolder, '/src');
  var srcdestination = path.join(destinationfolder, '/src');

  copy(srcsource, srcdestination, (r, err) => {

    if (!r) {
      return console.error(err);
    }

  });

  var testssource = path.join(sourcefolder, '/tests');
  var testsdestination = path.join(destinationfolder, '/tests');

  copy(testssource, testsdestination, (r, err) => {

    if (!r) {
      return console.error(err);
    }
  });

  var vscodesource = path.join(sourcefolder, '/.vscode');
  var vscodedestination = path.join(destinationfolder, '/.vscode');

  copy(vscodesource, vscodedestination, (r, err) => {

    if (!r) {
      return console.error(err);
    }
  });

  var docssource = path.join(sourcefolder, '/docs');
  var docsdestination = path.join(destinationfolder, '/docs');

  copy(docssource, docsdestination, (r, err) => {

    if (!r) {
      return console.error(err);
    }
  });


  var envsource = path.join(sourcefolder, '.env');


  copy(envsource, path.join(destinationfolder, '.env'), (r, err) => {

    if (!r) {
      return console.error(err);
    }
    
  });
 

  var packagesource = path.join(sourcefolder, 'package.json');


  copy(packagesource, path.join(destinationfolder, 'package.json'), (r, err) => {

    if (!r) {
      return console.error(err);
    }


    //rename
    fs.rename(path.join(destinationfolder, "package.json"), path.join(destinationfolder, "_package.json"), function (err) {
      if (err) {
        console.log('ERROR: ' + err);
        return;
      }
      //update file
      var replace = require("replace");
      replace({
        regex: '"name": "funkynode",',
        replacement: '"name": "<%= name %>",',
        paths: [path.join(destinationfolder, "_package.json")],
        recursive: true,
        silent: true,
      });
    });

  });


});


function copy(source, destination, callback) {
  var ncp = require('ncp').ncp;
  ncp.limit = 16;
  ncp(source, destination, function (err) {
    if (err) {
      callback(false, err);
    }
    console.log('all files and folders in ' + source + ' copied to ' + destination);
    callback(true);
  });
}