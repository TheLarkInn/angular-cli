import * as path from 'path';
import * as ExtractTextPlugin from 'extract-text-webpack-plugin';
import * as CopyWebpackPlugin from 'copy-webpack-plugin';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as webpack from 'webpack';
import { ForkCheckerPlugin } from 'awesome-typescript-loader';
import { CliConfig } from './config';

export function getWebpackCommonConfig(projectRoot: string, sourceDir: string) {
  const styles = CliConfig.fromProject().apps
    .map(app => Object.keys(app.styles))
    .map((style) => {return path.resolve(projectRoot, style.pop())})

  const flattenedStyles = [].concat.apply([], styles);
  const extractCSS = new ExtractTextPlugin('style.css');


  return {
    devtool: 'inline-source-map',
    resolve: {
      extensions: ['', '.ts', '.js'],
      root: path.resolve(projectRoot, `./${sourceDir}`)
    },
    context: path.resolve(__dirname, './'),
    entry: {
      main: [path.resolve(projectRoot, `./${sourceDir}/main.ts`)].concat(flattenedStyles),
      polyfills: path.resolve(projectRoot, `./${sourceDir}/polyfills.ts`)
    },
    output: {
      path: path.resolve(projectRoot, './dist'),
      filename: '[name].bundle.js'
    },
    module: {
      preLoaders: [
        {
          test: /\.js$/,
          loader: 'source-map-loader',
          exclude: [
            path.resolve(projectRoot, 'node_modules/rxjs'),
            path.resolve(projectRoot, 'node_modules/@angular'),
          ]
        }
      ],
      loaders: [
        {
          test: /\.ts$/,
          loaders: [
            {
              loader: 'awesome-typescript-loader',
              query: {
                useForkChecker: true,
                tsconfig: path.resolve(projectRoot, `./${sourceDir}/tsconfig.json`)
              }
            },
            {
              loader: 'angular2-template-loader'
            }
          ],
          exclude: [/\.(spec|e2e)\.ts$/]
        },

        { include: flattenedStyles, test: /\.css$/,  loader:  extractCSS.extract(['css-loader', 'postcss-loader'])},
        { include: flattenedStyles, test: /\.styl$/, loader:  extractCSS.extract(['css-loader', 'postcss-loader', 'stylus-loader'])},
        { include: flattenedStyles, test: /\.less$/, loader:  extractCSS.extract(['css-loader', 'postcss-loader', 'less-loader'])},
        { include: flattenedStyles, test: /\.scss$|\.sass$/, loader:  extractCSS.extract(['css-loader', 'postcss-loader', 'sass-loader'])},

        { exclude: flattenedStyles, test: /\.css$/,  loaders: ['raw-loader', 'postcss-loader'] },
        { exclude: flattenedStyles, test: /\.styl$/, loaders: ['raw-loader', 'postcss-loader', 'stylus-loader'] },
        { exclude: flattenedStyles, test: /\.less$/, loaders: ['raw-loader', 'postcss-loader', 'less-loader'] },
        { exclude: flattenedStyles, test: /\.scss$|\.sass$/, loaders: ['raw-loader', 'postcss-loader', 'sass-loader'] },

        { test: /\.json$/, loader: 'json-loader'},
        { test: /\.(jpg|png)$/, loader: 'url-loader?limit=128000'},
        { test: /\.html$/, loader: 'raw-loader' }
      ]
    },
    plugins: [
      new ForkCheckerPlugin(),
      new HtmlWebpackPlugin({
        template: path.resolve(projectRoot, `./${sourceDir}/index.html`),
        chunksSortMode: 'dependency'
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: ['polyfills']
      }),
      new webpack.optimize.CommonsChunkPlugin({
        minChunks: Infinity,
        name: 'inline',
        filename: 'inline.js',
        sourceMapFilename: 'inline.map'
      }),
      new CopyWebpackPlugin([{
        context: path.resolve(projectRoot, './public'),
        from: '**/*',
        to: path.resolve(projectRoot, './dist')
      }]),
      extractCSS
    ],
    node: {
      global: 'window',
      crypto: 'empty',
      module: false,
      clearImmediate: false,
      setImmediate: false
    }
  }
};
