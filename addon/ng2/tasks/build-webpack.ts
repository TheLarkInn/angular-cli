import {webpackOutputOptions, webpackDevConfig, webpackProdConfig, webpackVendorDLLConfig} from '../models/';

import {ServeTaskOptions} from '../commands/serve';

// Configure build and output;
const Task            = require('ember-cli/lib/models/task');
const webpack         = require('webpack');

let lastHash = null;

module.exports = Task.extend({
  // Options: String outputPath
  run: (runTaskOptions: ServeTaskOptions) => {

    // TODO#: Variable Config for environments.
    const webpackCompiler = webpack(webpackProdConfig(this.project));
    const ProgressPlugin  = require('webpack/lib/ProgressPlugin');

    webpackCompiler.apply(new ProgressPlugin({
      profile: true
    }));

    return new Promise((resolve, reject) => {
      webpackCompiler.run((err, stats) => {
        // Don't keep cache
        // TODO: Make conditional if using --watch
        webpackCompiler.purgeInputFileSystem();

        if(err) {
          lastHash = null;
          console.error(err.stack || err);
          if(err.details) console.error(err.details);
            reject(err.details);
        }

        if(stats.hash !== lastHash) {
          lastHash = stats.hash;
          process.stdout.write(stats.toString(webpackOutputOptions) + "\n");
        }
        resolve();
      });
    });
  }
});
