import * as path from 'path';
import * as ExtractTextPlugin from 'extract-text-webpack-plugin';
import * as CopyWebpackPlugin from 'copy-webpack-plugin';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as webpack from 'webpack';
import { ForkCheckerPlugin } from 'awesome-typescript-loader';
import { CliConfig } from './config';

export function getWebpackCommonConfig(projectRoot: string, sourceDir: string) {
  const styles = CliConfig.fromProject().apps
    .map(app => app.styles)


  const flattenedStyles = [].concat.apply([], styles)
    .map((style) => {style.path = path.resolve(projectRoot, style.path); return style});

  const flattenedStylesPaths = flattenedStyles.map(style => style.path);

  const extractCSS = new ExtractTextPlugin({filename: 'style.css', allChunks: 'true'});


  return {
    devtool: 'inline-source-map',
    resolve: {
      extensions: ['', '.ts', '.js'],
      root: path.resolve(projectRoot, `./${sourceDir}`)
    },
    context: path.resolve(__dirname, './'),
    entry: {
      main: [path.resolve(projectRoot, `./${sourceDir}/main.ts`)].concat(flattenedStylesPaths),
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

        { include: flattenedStylesPaths, test: /\.css$/,  loader:  extractCSS.extract(['css-loader', 'postcss-loader'])},
        { include: flattenedStylesPaths, test: /\.styl$/, loader:  extractCSS.extract(['css-loader', 'postcss-loader', 'stylus-loader'])},
        { include: flattenedStylesPaths, test: /\.less$/, loader:  extractCSS.extract(['css-loader', 'postcss-loader', 'less-loader'])},
        { include: flattenedStylesPaths, test: /\.scss$|\.sass$/, loader:  extractCSS.extract(['css-loader', 'postcss-loader', 'sass-loader'])},

        { exclude: flattenedStylesPaths, test: /\.css$/,  loaders: ['raw-loader', 'postcss-loader'] },
        { exclude: flattenedStylesPaths, test: /\.styl$/, loaders: ['raw-loader', 'postcss-loader', 'stylus-loader'] },
        { exclude: flattenedStylesPaths, test: /\.less$/, loaders: ['raw-loader', 'postcss-loader', 'less-loader'] },
        { exclude: flattenedStylesPaths, test: /\.scss$|\.sass$/, loaders: ['raw-loader', 'postcss-loader', 'sass-loader'] },

        { test: /\.json$/, loader: 'json-loader'},
        { test: /\.(jpg|png)$/, loader: 'url-loader?limit=128000'},
        { test: /\.html$/, loader: 'raw-loader' },

        {test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff'},
        {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream'},
        {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file'},
        {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml'}
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
