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

  writing() {
    //todo az refactor

    var destinationfolder = this.destinationRoot();
    this.log("copying files to " + destinationfolder);
    //Copy the configuration files

    this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'), {
          name: this.props.name
        }
    );


    // Copy all files
    this.fs.copy(
       this.templatePath('src/*.*'),
       destinationfolder + '/src'
     );
    this.fs.copy(
      this.templatePath('src/contract'),
      destinationfolder + '/src/contract'
    );
    this.fs.copy(
   this.templatePath('src/dialogs'),
   destinationfolder + '/src/dialogs'
 );
    this.fs.copy(
   this.templatePath('src/helpers'),
   destinationfolder + '/src/helpers'
 );
    this.fs.copy(
      this.templatePath('src/services'),
      destinationfolder + '/src/services'
    );

    this.fs.copy(
      this.templatePath('tests'),
      destinationfolder + '/tests'
    );

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
    this.tasks.push({cmd: 'tsc', args: ['-p', './src']}); //todo az - need to change directory

    //start first task
    this.processTask(this.tasks.shift());


  }

};

