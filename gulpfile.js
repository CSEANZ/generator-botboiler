require('dotenv').config();
var gulp = require('gulp');
var fs = require('fs');
var path = require('path');


// update generator
gulp.task('updategenerator', function () {

  var env = process.env;
  console.log("process.env.GeneratorBotboilerPath");
  console.log(process.env.GeneratorBotboilerPath);


  if (env === null ||
    env.GeneratorBotboilerPath === null ||
    env.GeneratorBotboilerPath === undefined ||
    env.GeneratorBotboilerPath === '') {
    console.error('Error: Please clone https://github.com/MSFTAuDX/generator-botboiler and then set the value GeneratorBotboilerPath in your .env')
    return;
  }

  if (env === null ||
    env.BotboilerPath === null ||
    env.BotboilerPath === undefined ||
    env.BotboilerPath === '') {
    console.error('Error: Please clone https://github.com/MSFTAuDX/botboiler and then set the value GeneratorBotboilerPath in your .env')
    return;
  }
  
  //var gulpRanInThisFolder = process.cwd();
  var sourcefolder =env.BotboilerPath;
  var destinationfolder = path.join(env.GeneratorBotboilerPath, '/generators\/app\/templates\/');
 
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