'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const path = require('path');
module.exports = class extends Generator {

  prompting() {

    // Have Yeoman greet the user.
    this.log(yosay(
      chalk.white.bgRed.bold('botboiler generator') + ' helps you to start building a bot by using ' + chalk.underline.bgBlue('Node js') + ", " + chalk.underline.bgBlue('Typescript') + ", " + chalk.underline.bgBlue('Azure Functions') + " and " + chalk.underline.bgBlue('Microsoft bot builder')

    ));
    //todo az add validation on the name -> it shouldn't have space in the name
    const prompts = [{
      type: 'input',
      name: 'name',
      message: 'What\'s the chat bot project name?',
      //Defaults to the project's folder name if the input is skipped
      default: this.appname
    }];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });

  }

  updatePackage() {

    var botname=this.props.name.replace(/\s+/g, '-');

    this.fs.copyTpl(
      this.templatePath('_package.json'),
      this.destinationPath('package.json'), {
        name: botname
      }
    );

  }
  copySrouceCode() {

    var self = this;

    var source = path.join(this.sourceRoot(), '/src');
    var destination = path.join(this.destinationRoot(), '/src');

    var ncp = require('ncp').ncp;
    //ncp.limit = 16;
    this.log('coping *.* from ' + source + ' to ' + destination);
    ncp(source, destination, function (err) {

      if (err) {
        self.log('something went wrong: ' + err);

      }
      self.log('done');
    });

  }
copyVscode() {

    var self = this;

    var source = path.join(this.sourceRoot(), '/.vscode');
    var destination = path.join(this.destinationRoot(), '/.vscode');

    var ncp = require('ncp').ncp;
    //ncp.limit = 16;
    this.log('coping *.* from ' + source + ' to ' + destination);
    ncp(source, destination, function (err) {

      if (err) {
        self.log('something went wrong: ' + err);

      }
      self.log('done');
    });

  }
  copyDocs() {

    var self = this;

    var source = path.join(this.sourceRoot(), '/docs');
    var destination = path.join(this.destinationRoot(), '/docs');

    var ncp = require('ncp').ncp;
    //ncp.limit = 16;
    this.log('coping *.* from ' + source + ' to ' + destination);
    ncp(source, destination, function (err) {

      if (err) {
        self.log('something went wrong: ' + err);

      }
      self.log('done');
    });

  }
  copyTests() {

    var self = this;
    var sourcetests = path.join(this.sourceRoot(), '/tests');
    var destinationtests = path.join(this.destinationRoot(), '/tests');

    var ncptests = require('ncp').ncp;
    ncptests.limit = 16;
    this.log('coping *.* from ' + sourcetests + ' to ' + destinationtests);
    ncptests(sourcetests, destinationtests, function (err) {

      if (err) {
        self.log('something went wrong: ' + err);
      }
      self.log('all files and folders in ' + sourcetests + ' copied to ' + destinationtests);

    });

  }

  install() {

    this.processTask = function (task) {

      this.log(task.cmd + ((task.args !== undefined) ? (" " + task.args) : ""));

      this.spawnCommand(task.cmd, task.args)
        .on('exit', function (err) {
          if (err) {
            this.log.error('task failed. Error: ' + err);
          } else {
            this.emit('nextTask');
          }
        }.bind(this));


    };

    this.on('nextTask', function () {
      var next = this.tasks.shift();
      if (next) {
        this.processTask(next);
      } else {

      }
    }.bind(this));

    //preparing the list of tasks:
    this.tasks = [];
    this.tasks.push({ cmd: 'npm', args: ['install'] });
    // this.tasks.push({cmd: 'tsc', args: ['-p', './src']}); //todo az - need to change directory

    //start first task
    this.processTask(this.tasks.shift());


  }

};

