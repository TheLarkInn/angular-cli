const Command = require('ember-cli/lib/models/command');
const win = require('ember-cli/lib/utilities/windows-admin');

// const Build = require('../tasks/build');
// const BuildWatch = require('../tasks/build-watch');

const WebpackBuild = require('../tasks/build-webpack');
const WebpackBuildWatch = require('../tasks/build-webpack-watch');

interface BuildOptions {
  environment?: string;
  outputPath?: string;
  watch?: boolean;
  watcher?: string;
  supressSizes: boolean;
}

module.exports = Command.extend({
  name: 'build',
  description: 'Builds your app and places it into the output path (dist/ by default).',
  aliases: ['b'],

  availableOptions: [
    { name: 'environment',    type: String,  default: 'development', aliases: ['e', { 'dev': 'development' }, { 'prod': 'production' }] },
    { name: 'output-path',    type: 'Path',  default: 'dist/',       aliases: ['o'] },
    { name: 'watch',          type: Boolean, default: false,         aliases: ['w'] },
    { name: 'watcher',        type: String },
    { name: 'suppress-sizes', type: Boolean, default: false },

    // Experimental webpack build for material team
    { name: 'm2', type: Boolean, default: false}
  ],

  run: function(commandOptions: BuildOptions) {
    debugger;
    let buildTask = commandOptions.watch ?
      new WebpackBuildWatch({
        project: this.project,
        ui: this.ui,
        outputPath: commandOptions.outputPath,
        environment: commandOptions.environment
      }) :
      new WebpackBuild({
        project: this.project,
        ui: this.ui,
        outputPath: commandOptions.outputPath,
        environment: commandOptions.environment
      });

    console.log(buildTask);

    return buildTask.run(commandOptions);
  }
});

module.exports.overrideCore = true;
