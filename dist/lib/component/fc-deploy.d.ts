import { Component } from './component';
import { ServiceConfig } from '../interface/fc-service';
import { FunctionConfig } from '../interface/fc-function';
import { TriggerConfig } from '../interface/fc-trigger';
import { CustomDomainConfig } from '../interface/fc-custom-domain';
import { ServerlessProfile } from '../profile';
import { ICredentials } from '../../common/entity';
export declare class FcDeployComponent extends Component {
    readonly serviceConf: ServiceConfig;
    readonly functionConf?: FunctionConfig;
    readonly region: string;
    readonly triggers?: TriggerConfig[];
    readonly customDomains?: CustomDomainConfig[];
    constructor(serverlessProfile: ServerlessProfile, region: string, credentials: ICredentials, serviceConf: ServiceConfig, functionConf?: FunctionConfig, triggerConfList?: TriggerConfig[], customDomainConfList?: CustomDomainConfig[], curPath?: any);
    genComponentProp(): {
        [key: string]: any;
    };
}
