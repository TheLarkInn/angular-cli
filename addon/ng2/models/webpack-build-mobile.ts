import * as webpack from 'webpack';
import * as path from 'path';
import * as SingleEntryPlugin from 'webpack/lib/SingleEntryPlugin';
import * as OfflinePlugin from 'offline-plugin';
import { PrerenderWebpackPlugin } from '../utilities/prerender-webpack-plugin.ts'

export const getWebpackMobileConfigPartial = function (projectRoot: string) {
  return {
    plugins: [
      new PrerenderWebpackPlugin({
        templatePath: 'index.html',
        configPath: path.resolve(projectRoot, './src/main-app-shell.ts'),
        appPath: path.resolve(projectRoot, './src')
      })
    ]
  }
};

export const getWebpackMobileProdConfigPartial = function (projectRoot: string) {
  return {
    plugins: [
      new OfflinePlugin(),
      new SingleEntryPlugin(__dirname, path.join(__dirname, '../utilities/sw-install.js'), 'sw-install'),
    ]
  }
};
