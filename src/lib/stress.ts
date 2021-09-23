import { ICredentials } from '../common/entity';
import { FcClient } from './fc';
import * as path from 'path';
import { replaceProjectName, ServerlessProfile, IInputsBase } from './profile';
import * as core from '@serverless-devs/core';
import logger from '../common/logger';
import * as yaml from 'js-yaml';
import os from 'os';
import * as fse from 'fs-extra';
import StdoutFormatter from './component/stdout-formatter';
import { HttpTypeOption, EventTypeOption, StressOption } from './interface/interface';
import { promptForConfirmContinue } from './utils/prompt';
import _ from 'lodash';
import * as rimraf from 'rimraf';
import tryRequire from 'try-require';
import sd from 'silly-datetime';
import {ServiceConfig} from "./interface/fc-service";
import {FunctionConfig} from "./interface/fc-function";
import {FcDeployComponent} from "./component/fc-deploy";
const pkg = tryRequire(path.join(__dirname, '..', '..', 'package.json'));
const VERSION: string = pkg?.version || '0.0.0';

export class FcStress extends IInputsBase{
  private readonly httpTypeOpts?: HttpTypeOption;
  private readonly eventTypeOpts?: EventTypeOption;
  private readonly stressOpts?: StressOption;
  private readonly fcClient: FcClient;

  private static readonly fcDefaultRoleName: string = 'AliyunFCDefaultRole';
  private static readonly supportedFunctionTypes: string[] = ['event', 'http'];
  private static readonly defaultCacheDir: string = path.join(os.homedir(), '.s', 'cache', 'fc-stress');
  private static readonly defaultVersionCacheDir: string = path.join(FcStress.defaultCacheDir, VERSION);
  private static readonly defaultHtmlCacheDir: string = path.join(FcStress.defaultCacheDir, 'html');
  // 辅助函数被部署过的 region 列表，表示在目标 region 已经部署过该版本组件对应的辅助函数
  private static readonly helperFunctionDeployedRegionFile: string = path.join(FcStress.defaultVersionCacheDir, 'region.json');
  private static readonly defaultServiceName: string = `_DEFAULT_FC_STRESS_COMPONENT_SERVICE`;
  private static readonly defaultFunctionProp: FunctionConfig = {
    name: `_DEFAULT_FC_STRESS_COMPONENT_SERVICE`,
    handler: 'index.handler',
    runtime: 'python3',
    codeUri: path.join(__dirname, 'utils', 'stress_test', 'code.zip'),
    memorySize: 3072,
    timeout: 600,
    environmentVariables: {
      PATH: "/code/.s/root/usr/local/bin:/code/.s/root/usr/local/sbin:/code/.s/root/usr/bin:/code/.s/root/usr/sbin:/code/.s/root/sbin:/code/.s/root/bin:/code:/code/node_modules/.bin:/code/.s/python/bin:/code/.s/node_modules/.bin:/usr/local/bin:/usr/local/sbin:/usr/bin:/usr/sbin:/sbin:/bin",
      PYTHONUSERBASE: "/code/.s/python",
      TZ: "Asia/Shanghai",
      LD_LIBRARY_PATH: '/code/'
    }
  };
  private static readonly defaultStressOpts: StressOption = {
    functionType: '',
    numUser: 6,
    spawnRate: 10,
    runningTime: 30,
    invocationType: 'Sync'
  }

  constructor(serverlessProfile: ServerlessProfile, creds: ICredentials, region: string, stressOpts?: StressOption, httpTypeOpts?: HttpTypeOption, eventTypeOpts?: EventTypeOption, curPath?: any, endpoint?: string) {
    super(serverlessProfile, region, creds, curPath);

    this.stressOpts = stressOpts;
    if (this.stressOpts) {
      this.stressOpts.numUser = this.stressOpts.numUser || FcStress.defaultStressOpts.numUser;
      this.stressOpts.spawnRate = this.stressOpts.spawnRate || FcStress.defaultStressOpts.spawnRate;
      this.stressOpts.runningTime = this.stressOpts.runningTime || FcStress.defaultStressOpts.runningTime;
      this.stressOpts.invocationType = this.stressOpts.invocationType || FcStress.defaultStressOpts.invocationType;
      logger.info(StdoutFormatter.stdoutFormatter.using('stress options', `\n${yaml.dump(this.stressOpts)}`));
    }
    this.httpTypeOpts = httpTypeOpts;
    this.eventTypeOpts = eventTypeOpts;
    this.fcClient = new FcClient(this.region, this.credentials, null, endpoint);
  }

  public validate(): boolean {
    if (this.stressOpts) {
      const functionType: string = this.stressOpts.functionType;
      if (!functionType) {
        logger.error(`Please input function type!`);
        return false;
      }
      if (!_.includes(FcStress.supportedFunctionTypes, functionType)) {
        logger.error(`Unsupported function type: ${functionType}`);
        return false;
      }
    }
    return true;
  }

  private async makeHelperFunction(isDebug?: boolean): Promise<void> {
    const defaultServiceProp: ServiceConfig = {
      name: FcStress.defaultServiceName,
      role: `acs:ram::${this.credentials.AccountID}:role/${FcStress.fcDefaultRoleName}`,
    };
    const profileOfFcdeploy = replaceProjectName(this.serverlessProfile, `${this.serverlessProfile?.project?.projectName}-fc-deploy-project`);
    // 在调用 fc-deploy 时，保证生成的 .s 文件夹放在 FcStress.helperFunctionDeployedRegionFile 下
    process.env['templateFile'] = FcStress.helperFunctionDeployedRegionFile;
    const fcDeployComponent: FcDeployComponent = new FcDeployComponent(
        profileOfFcdeploy,
        this.region,
        this.credentials,
        defaultServiceProp,
        FcStress.defaultFunctionProp,
        null,
        null,
        this.curPath,
    );
    const agrsOfFcDeploy: string = isDebug ? '--use-local -y --debug' : '--use-local -y';
    const fcDeployComponentInputs = fcDeployComponent.genComponentInputs('fc-deploy', agrsOfFcDeploy);
    const fcDeployComponentIns: any = await core.loadComponent(`devsapp/fc-deploy`);
    await fcDeployComponentIns.deploy(fcDeployComponentInputs);
  }

  private async removeHelperFunction(isDebug?: boolean): Promise<void> {
    const defaultServiceProp: ServiceConfig = {
      name: FcStress.defaultServiceName,
    };
    const profileOfFcdeploy = replaceProjectName(this.serverlessProfile, `${this.serverlessProfile?.project?.projectName}-fc-deploy-project`);

    const fcDeployComponent: FcDeployComponent = new FcDeployComponent(
        profileOfFcdeploy,
        this.region,
        this.credentials,
        defaultServiceProp,
        null,
        null,
        null,
        this.curPath,
    );
    const agrsOfFcDeploy: string = isDebug ? '-y --debug' : '-y';
    const fcDeployComponentInputs = fcDeployComponent.genComponentInputs('fc-deploy', agrsOfFcDeploy);
    const fcDeployComponentIns: any = await core.loadComponent(`devsapp/fc-deploy`);
    await fcDeployComponentIns.remove(fcDeployComponentInputs);
  }

  public async init(isDebug?: boolean) {
    if (await this.checkIfNecessaryToDeployHelper()) {
      // 部署辅助函数
      await this.makeHelperFunction(isDebug);
      await this.makeHelpFunctionDeployedRegionFile();
    }
  }

  private async checkIfNecessaryToDeployHelper(): Promise<boolean> {
    /*
    两种情况需要部署辅助函数:
    1. 线上辅助资源不存在
    2. 该版本组件对应的辅助函数未被部署过
    */

    if (!await this.fcClient.checkIfFunctionExist(FcStress.defaultServiceName, FcStress.defaultFunctionProp.name)) {
      logger.debug(`Helper function not exist online.`)
      return true;
    }
    if (!await fse.pathExists(FcStress.helperFunctionDeployedRegionFile)) {
      logger.debug(`${FcStress.helperFunctionDeployedRegionFile} not exist.`);
      return true;
    }
    const regionList: string[] = JSON.parse(await fse.readFile(FcStress.helperFunctionDeployedRegionFile, { encoding: 'utf-8',  }));
    logger.debug(`Deployed region list: ${regionList}`);
    if (!_.includes(regionList, this.region)) {
      logger.debug(`The version of helper function has not been deployed in the region: ${this.region}`);
      return true;
    }
    return false;
  }

  private async makeHelpFunctionDeployedRegionFile(): Promise<void> {
    await fse.ensureDir(path.dirname(FcStress.helperFunctionDeployedRegionFile));
    let regionList: string[] = [];
    if (await fse.pathExists(FcStress.helperFunctionDeployedRegionFile)) {
      // append
      regionList = JSON.parse(await fse.readFile(FcStress.helperFunctionDeployedRegionFile, { encoding: 'utf-8',  }));
    }
    regionList.push(this.region);
    logger.debug(`Newly region list: ${regionList}`);
    await fse.writeFile(FcStress.helperFunctionDeployedRegionFile, JSON.stringify(regionList), {flag: 'w', mode: 0o777});
  }

  public async invoke(endpoint?: string): Promise<any> {
    const event: any = {
      NUM_USERS: this.stressOpts.numUser,
      SPAWN_RATE: this.stressOpts.spawnRate,
      RUN_TIME: this.stressOpts.runningTime,
      REPORT_HTML: true,
      functionType: this.stressOpts.functionType,
      INVOCATION_TYPE: this.stressOpts.invocationType,
    };
    if (endpoint) {
      Object.assign(event, {
        CUSTOM_HOST: endpoint.replace(/(^\w+:|^)\/\//, ''),
      })
    }

    if (this.isEventFunctionType()) {
      Object.assign(event, this.eventTypeOpts);
    } else if (this.isHttpFunctionType) {
      Object.assign(event, this.httpTypeOpts);
    }
    logger.debug(`Event of invoking function is: \n${yaml.dump(event)}`);
    const invokeRes: any = await this.fcClient.invokeFunction(FcStress.defaultServiceName, FcStress.defaultFunctionProp.name, JSON.stringify(event));
    return invokeRes;
  }

  public isEventFunctionType(): boolean {
    return this.stressOpts.functionType === 'event';
  }

  public isHttpFunctionType(): boolean {
    return this.stressOpts.functionType === 'http';
  }

  public async showHtmlReport(data: any): Promise<void> {
    const htmlContent: string = data.report_html;
    await fse.ensureDir(FcStress.defaultHtmlCacheDir);
    let cacheHtmlFileName: string;
    const curTimestamp: string = sd.format(new Date(), 'YYYY-MM-DDTHH-mm-ss');
    if (this.isEventFunctionType()) {
      cacheHtmlFileName = `${this.eventTypeOpts.serviceName}.${this.eventTypeOpts.qualifier}-${this.eventTypeOpts.functionName}#${curTimestamp}.html`;
    } else if (this.isHttpFunctionType()) {
      cacheHtmlFileName = `url#${curTimestamp}.html`;
    }
    const cacheHtmlFilePath: string = path.join(FcStress.defaultHtmlCacheDir, cacheHtmlFileName || '');
    await fse.writeFile(cacheHtmlFilePath, htmlContent, {flag: 'w'});
    logger.log(`Html report flie: ${cacheHtmlFilePath}\nExecute 'open ${cacheHtmlFilePath}' on macos for html report with browser.`, 'yellow');
  }

  public async clean(assumeYes?: boolean, isDebug?: boolean): Promise<any> {
    // 删除辅助函数
    await this.removeHelperFunction(isDebug);
    // TODO：删除 role
    // 删除 html 文件
    const msg: string = `Are you sure to remove all the history html report files under ${FcStress.defaultHtmlCacheDir}?`;
    if (assumeYes || await promptForConfirmContinue(msg)) {
      rimraf.sync(FcStress.defaultHtmlCacheDir);
    }
  }

  public processError(data: any): any {
    if (data?.errorMessage) {
      if (data?.errorMessage.includes(`[Errno 2] No such file or directory: '/tmp/report.html'`)) {
        throw new Error(`Invalid format of payload.`);
      }
      throw new Error(`Helper function error type: ${data?.errorType}, error message: ${data?.errorMessage}`);
    }
    if (_.isString(data) && _.toLower(data).includes('error')) {
      throw new Error(data);
    }
  }
}
