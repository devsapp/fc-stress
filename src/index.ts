import BaseComponent from './common/base';
import logger from './common/logger';
import { InputProps, ICredentials } from './common/entity';
import * as _ from 'lodash';
import * as core from '@serverless-devs/core';
import StdoutFormatter from './lib/component/stdout-formatter';
import { FcStress } from './lib/stress';
import { ServerlessProfile } from './lib/profile';
import { HttpTypeOption, EventTypeOption, StressOption } from './lib/interface/interface';
import { payloadPriority } from './lib/utils/file';
import { START_HELP_INFO, CLEAN_HELP_INFO } from './lib/static';
import {getEndpointFromFcDefault} from "./lib/utils/endpoint";
import {capitalizeFirstLetter} from "./lib/utils/utils";

export default class FcStressComponent extends BaseComponent {
  constructor(props) {
    super(props)
  }
  private async report(componentName: string, command: string, accountID?: string, access?: string): Promise<void> {
    let uid: string = accountID;
    if (_.isEmpty(accountID)) {
      try {
        const credentials: ICredentials = await core.getCredential(access);
        uid = credentials.AccountID;
      } catch (e) {
        logger.warning(StdoutFormatter.stdoutFormatter.warn('get credential', `failed, access is: ${access}`));
        logger.debug(`Get credentials error: ${e}`);
      }

    }
    core.reportComponent(componentName, {
      command,
      uid,
    }).catch((e) => {
      logger.warning(StdoutFormatter.stdoutFormatter.warn('component report', `failed, component name: ${componentName}, method: ${command}`));
      logger.debug(`Report component error: ${e}`);
    });
  }

  private argsParser(inputs: InputProps): any {
    const apts: any = {
      boolean: ['help', 'assume-yes'],
      alias: {
        'help': 'h',
        'region': 'r',
        'access': 'a',
        'qualifier': 'q',
        'url': 'u',
        'method': 'm',
        'payload': 'p',
        'payload-file': 'f',
        'assume-yes': 'y'},
    };
    const comParse: any = core.commandParse(inputs, apts);

    // 将Args转成Object
    comParse.data = comParse.data || {};
    const {
      region,
      qualifier,
      url,
      method,
      payload,
      help
    } = comParse.data;
    const access: string = comParse.data?.access || inputs?.project?.access;
    const isDebug = comParse.data.debug || process.env?.temp_params?.includes('--debug');
    const functionName: string = comParse.data['function-name'];
    const serviceName: string = comParse.data['service-name'];
    const functionType: string = comParse.data['function-type'];
    const assumeYes: boolean = comParse.data['assume-yes'];
    const numUser: number = _.toInteger(comParse.data['num-user']);
    const spawnRate: number = _.toInteger(comParse.data['spawn-rate']);
    const runningTime: number = _.toInteger(comParse.data['run-time']);
    const payloadFile: string = comParse.data['payload-file'];
    const invocationType: string = capitalizeFirstLetter(_.toLower(comParse.data['invocation-type'])) || 'Sync';
    return {
      region, access, qualifier, url, method, isDebug,
      payload, help, functionName, serviceName, functionType,
      numUser, spawnRate, runningTime,payloadFile, assumeYes, invocationType
    };
  }

  /**
   * start stress test
   * @param inputs
   * @returns
   */
  public async start(inputs: InputProps): Promise<any> {
    await StdoutFormatter.initStdout();
    const {
      region, access, qualifier, url, method, isDebug,
      payload, help, functionName, serviceName, functionType,
      numUser, spawnRate, runningTime, payloadFile, invocationType
    } = this.argsParser(inputs);
    await this.report('fc-stress', 'stress', null, access);
    if (help) {
      core.help(START_HELP_INFO);
      return;
    }
    const creds: ICredentials = await core.getCredential(access);

    const serverlessProfile: ServerlessProfile = {
      project: {
        access,
        projectName: inputs?.project?.projectName
      },
      appName: inputs?.appName
    };
    const stressOpts: StressOption = {
      numUser,
      spawnRate,
      runningTime,
      functionType,
      invocationType,
    };
    logger.info(`Reading payload content...`)
    const payloadContent = await payloadPriority(payload, payloadFile);

    let httpTypeOpts: HttpTypeOption = null;
    let eventTypeOpts: EventTypeOption = null;
    if (functionType === 'event') {
      eventTypeOpts = Object.assign({}, {
        serviceName,
        functionName,
        qualifier: qualifier || "LATEST",
        payload: payloadContent
      });
    } else if (functionType === 'http') {
      httpTypeOpts = Object.assign({}, {
        url,
        method,
        body: payloadContent
      });
    }
    const endpoint: string = await getEndpointFromFcDefault();
    const fcStress: FcStress = new FcStress(serverlessProfile, creds, region, stressOpts, httpTypeOpts, eventTypeOpts, inputs?.path, endpoint);
    if (!fcStress.validate()) {
      return;
    }
    // 部署辅助函数
    logger.info(`Preparing helper reource for stress test.`);
    await fcStress.init(isDebug);
    // 调用函数
    let invokeRes: any;
    const stressVm = core.spinner(`Stress test...`);
    try {
      invokeRes = await fcStress.invoke(endpoint);
      stressVm.succeed(`Stress test complete.`);
    } catch (e) {
      stressVm.fail(`Stress test error.`);
      throw e;
    }

    // 展示结果
    let data: any = invokeRes?.data;

    if (_.isString(data)) {
      data = JSON.parse(data);
    }
    fcStress.processError(data);
    logger.info(`Displaying the result of stress test.`);
    await fcStress.showHtmlReport(data);

    delete data.report_html;
    return data;
  }

  /**
   * clean stress helper function and html report file
   * @param inputs
   * @returns
   */
   public async clean(inputs: InputProps): Promise<any> {
    const {
      region, access, help, assumeYes, isDebug
    } = this.argsParser(inputs);
    const creds: ICredentials = await core.getCredential(access);
    await this.report('fc-stress', 'clean', null, access);
    if (help) {
      core.help(CLEAN_HELP_INFO);
      return;
    }
    await StdoutFormatter.initStdout();
    const serverlessProfile: ServerlessProfile = {
      project: {
        access,
        projectName: inputs?.project?.projectName
      },
      appName: inputs?.appName
    };
    const endpoint: string = await getEndpointFromFcDefault();
    const fcStress: FcStress = new FcStress(serverlessProfile, creds, region, null, null, null, inputs?.path?.configPath, endpoint);

    logger.info(`Cleaning helper resource and local html report files...`);
    await fcStress.clean(assumeYes, isDebug);
  }

}
