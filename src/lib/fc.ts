import { ICredentials } from '../common/entity';
import FC from '@alicloud/fc2';
import logger from '../common/logger';
import * as path from 'path';
import os from 'os';
import * as fse from 'fs-extra';
import { packTo } from './zip';
import StdoutFormatter from './component/stdout-formatter';

export class FcClient {
  private readonly client: any;
  private readonly region: string;
  private readonly accountID: string;
  static readonly defaultTimeout: number = 600 * 1000;
  constructor(region: string, creds: ICredentials, timeout?: number, endpoint?: string) {

    this.client = new FC(creds.AccountID, {
      accessKeyID: creds.AccessKeyID,
      accessKeySecret: creds.AccessKeySecret,
      securityToken: creds.SecurityToken,
      region,
      timeout: timeout || FcClient.defaultTimeout,
      endpoint,
    });
    this.region = region;
    this.accountID = creds.AccountID;
  }

  async makeService(prop: any): Promise<any> {
    const { serviceName } = prop;
    try {
      logger.debug(StdoutFormatter.stdoutFormatter.create('service', serviceName));
      await this.client.createService(serviceName, prop);
    } catch (ex) {
      if (ex.code !== 'ServiceAlreadyExists') {
        logger.debug(`Creating service error, ex code: ${ex.code}, ex: ${ex.message}`);
        throw ex;
      }
      logger.debug(StdoutFormatter.stdoutFormatter.update('service', serviceName));
      await this.client.updateService(serviceName, prop);
    }
  }

  private async makeFunctionCode(serviceName: string, functionName: string, codeUri: string): Promise<string> {
    if (codeUri.endsWith('.zip') || codeUri.endsWith('.jar') || codeUri.endsWith('.war')) {
      return codeUri;
    }
    const cacheDir: string = path.join(os.homedir(), '.s', 'cache', 'fc-stress', 'code');
    await fse.ensureDir(cacheDir);
    const zipFilePath: string = path.join(cacheDir, `${this.accountID}-${this.region}-${serviceName}-${functionName}.zip`);
    await packTo(codeUri, null, zipFilePath);
    return zipFilePath;
  }

  async makeFunction(prop: any): Promise<any> {
    const { serviceName, functionName, codeUri } = prop;
    const zipFilePath: string = await this.makeFunctionCode(serviceName, functionName, codeUri);
    logger.debug(`Zip code file path: ${zipFilePath}`);
    prop.code = {
      zipFile: await fse.readFile(zipFilePath, 'base64'),
    };

    try {
      logger.debug(StdoutFormatter.stdoutFormatter.update('function', `${serviceName}/${functionName}`));
      await this.client.updateFunction(serviceName, functionName, prop);
    } catch (ex) {
      if (ex.code === 'FunctionNotFound') {
        prop.functionName = functionName;
        logger.debug(StdoutFormatter.stdoutFormatter.create('function', `${serviceName}/${functionName}`));
        await this.client.createFunction(serviceName, prop);
        return;
      }
      logger.debug(`Updating function error, ex code: ${ex.code}, ex: ${ex.message}`);
      throw ex;
    }
  }

  async removeFunction(serviceName: string, functionName: string): Promise<any> {
    try {
      logger.debug(`Removing function ${serviceName}/${functionName}...`);
      await this.client.deleteFunction(serviceName, functionName);
      logger.debug(`Removing function ${serviceName}/${functionName} success.`);
    } catch (ex) {
      logger.warning(`Removing function failed.\nex code: ${ex.code}, ex: ${ex.message}`);
    }
  }

  async removeService(serviceName: string): Promise<any> {
    try {
      logger.debug(`Removing service ${serviceName}...`);
      await this.client.deleteService(serviceName);
      logger.debug(`Removing service ${serviceName} success.`);
    } catch (ex) {
      logger.warning(`Removing service failed.\nex code: ${ex.code}, ex: ${ex.message}`);
    }
  }

  async invokeFunction(serviceName: string, functionName: string, event?: string | Buffer): Promise<any> {
    logger.debug(`Invoking service: ${serviceName}, function: ${functionName}`);
    return await this.client.invokeFunction(serviceName, functionName, event);
  }

  async checkIfFunctionExist(serviceName: string, functionName: string): Promise<boolean> {
    try {
      await this.client.getFunction(serviceName, functionName);
      return true;
    } catch (ex) {
      if (ex.code === 'FunctionNotFound' || ex.code === 'ServiceNotFound') {
        return false;
      }
      throw ex;
    }
  }
}
