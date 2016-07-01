import {
  getWebpackCommonConfig,
  getWebpackDevConfigPartial,
  getWebpackProdConfigPartial,
  getWebpackMaterialConfig,
  getWebpackMaterialE2EConfig
} from './';

const webpackMerge = require('webpack-merge');
const path = require('path');

export class NgCliWebpackConfig {
  public config: any;
  private webpackDevConfigPartial: any;
  private webpackProdConfigPartial: any;
  private webpackBaseConfig: any;
  private webpackMaterialConfig: any;
  private webpackMaterialE2EConfig: any;

  constructor(public ngCliProject: any, public environment: string) {
    this.webpackBaseConfig = getWebpackCommonConfig(this.ngCliProject.root);
    this.webpackMaterialConfig = getWebpackMaterialConfig(this.ngCliProject.root);
    this.webpackMaterialE2EConfig = getWebpackMaterialE2EConfig(this.ngCliProject.root);
    this.webpackDevConfigPartial = getWebpackDevConfigPartial(this.ngCliProject.root);
    this.webpackProdConfigPartial = getWebpackProdConfigPartial(this.ngCliProject.root);
    this.generateConfig();
  }

  generateConfig(): void {
    switch (this.environment) {
      case "d":
      case "dev":
      case "development":
      case "develop":
        this.config = webpackMerge(this.webpackBaseConfig, this.webpackDevConfigPartial);
        break;
      case "p":
      case "prod":
      case "production":
        this.config = webpackMerge(this.webpackBaseConfig, this.webpackProdConfigPartial);
        break;
      case "d:m":
      case "dev:mat":
      case "dev:material":
      case "development:mat":
      case "development:material":
        this.config = webpackMerge(this.webpackMaterialConfig, this.webpackDevConfigPartial);
        break;
      case "p:m":
      case "prod:mat":
      case "prod:material":
      case "production:mat":
      case "production:material":
        this.config = webpackMerge(this.webpackMaterialConfig, this.webpackProdConfigPartial);
        break;
      default:
        //TODO: Not sure what to put here. We have a default env passed anyways.
        this.ngCliProject.ui.writeLine("Envrionment could not be determined while configuring your build system.", 3)
        break;
    }
  }
}

