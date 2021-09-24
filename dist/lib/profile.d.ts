import * as core from '@serverless-devs/core';
import { ICredentials } from '../common/entity';
export declare class IInputsBase {
    logger: core.ILogger;
    readonly serverlessProfile: ServerlessProfile;
    readonly region: string;
    readonly credentials: ICredentials;
    readonly curPath?: any;
    constructor(serverlessProfile: ServerlessProfile, region: string, credentials: ICredentials, curPath?: any);
}
export declare function mark(source: string): string;
export interface ServerlessProfile {
    project: {
        component?: string;
        access: string;
        projectName: string;
    };
    appName: string;
}
export declare function replaceProjectName(originProfile: ServerlessProfile, projectName: string): ServerlessProfile;
