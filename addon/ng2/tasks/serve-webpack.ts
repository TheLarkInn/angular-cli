import {webpackDevServerOutputOptions} from '../models/';
import {NgCliWebpackConfig} from '../models/webpack-config';
import {ServeTaskOptions} from '../commands/serve';

const path = require('path');
const chalk = require('chalk');


const Task              = require('ember-cli/lib/models/task');
const webpack           = require('webpack');
const WebpackDevServer  = require('webpack-dev-server');
const ProgressPlugin    = require('webpack/lib/ProgressPlugin');



let lastHash = null;

module.exports = Task.extend({
  run: function(commandOptions: ServeTaskOptions) {

    let webpackCompiler: any;
    // if (commandOptions.environment === 'material') {
    //   webpackDevMaterialConfig.entry.main.unshift(`webpack-dev-server/client?http://localhost:${commandOptions.port}/`);
    //   webpackCompiler = webpack(webpackDevMaterialConfig);

    // } else if (commandOptions.environment === 'e2e') {
    //   webpackDevMaterialE2EConfig.entry.main.unshift(`webpack-dev-server/client?http://localhost:${commandOptions.port}/`);
    //   webpackCompiler = webpack(webpackDevMaterialE2EConfig);

    // } else {
    //   webpackDevConfig.entry.main.unshift(`webpack-dev-server/client?http://localhost:${commandOptions.port}/`);
    //   webpackCompiler = webpack(webpackDevConfig);
    // }

    // since the .config method on the returned instance is just an object we can modify any part of it for our needs
    var config = new NgCliWebpackConfig(this.project, commandOptions.environment).config;
    config.entry.main.unshift(`webpack-dev-server/client?http://localhost:${commandOptions.port}/`);
    webpackCompiler = webpack(config);


    webpackCompiler.apply(new ProgressPlugin({
      profile: true,
      colors: true
    }));

    const webpackDevServerConfiguration: IWebpackDevServerConfigurationOptions = {
      contentBase: path.resolve(process.cwd(), './src'),
      historyApiFallback: true,
      stats: webpackDevServerOutputOptions,
      inline: true
    };

    const serveMessage:string = chalk.green(`\n*\n*\n NG Live Development Server is running on http://localhost:${commandOptions.port}.\n*\n*`);
    const server = new WebpackDevServer(webpackCompiler, webpackDevServerConfiguration);

    return new Promise((resolve, reject) => {
      process.stdout.write(chalk.red('\n\n' + chalk.underline.bgYellow('TODO#'), 'Implement ENV Flags for serve builds.\n\n'));
      server.listen(commandOptions.port, "localhost", function(err, stats) {
        if(err) {
          lastHash = null;
          console.error(err.stack || err);
          if(err.details) console.error(err.details);
            reject(err.details);
        }

        if(stats && stats.hash && stats.hash !== lastHash) {
          lastHash = stats.hash;
          process.stdout.write(stats.toString(webpackOutputOptions) + "\n" + serveMessage + "\n");
        }

        process.stdout.write(serveMessage);
      });
    })
  }
});




