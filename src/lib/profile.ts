import * as _ from 'lodash';
import * as core from '@serverless-devs/core';
import { ICredentials } from '../common/entity';

export class IInputsBase {
  @core.HLogger('FC-DEPLOY') logger: core.ILogger;
  readonly serverlessProfile: ServerlessProfile;
  readonly region: string;
  readonly credentials: ICredentials;
  readonly curPath?: any;

  constructor(serverlessProfile: ServerlessProfile, region: string, credentials: ICredentials, curPath?: any) {
    this.serverlessProfile = serverlessProfile;
    this.region = region;
    this.credentials = credentials;
    if (!_.isNil(curPath)) { this.curPath = curPath; }
  }
}

export function mark(source: string): string {
  if (!source) { return source; }
  const subStr = source.slice(-4);
  return `***********${subStr}`;
}

export interface ServerlessProfile {
  project: {
    component?: string;
    access: string;
    projectName: string;
  };
  appName: string;
}

export function replaceProjectName(originProfile: ServerlessProfile, projectName: string): ServerlessProfile {
  const replacedProfile: ServerlessProfile = _.cloneDeep(originProfile);
  replacedProfile.project.projectName = projectName;
  return replacedProfile;
}
