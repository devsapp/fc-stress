/// <reference types="node" />
import { ICredentials } from '../common/entity';
export declare class FcClient {
    private readonly client;
    private readonly region;
    private readonly accountID;
    static readonly defaultTimeout: number;
    constructor(region: string, creds: ICredentials, timeout?: number, endpoint?: string);
    makeService(prop: any): Promise<any>;
    private makeFunctionCode;
    makeFunction(prop: any): Promise<any>;
    removeFunction(serviceName: string, functionName: string): Promise<any>;
    removeService(serviceName: string): Promise<any>;
    invokeFunction(serviceName: string, functionName: string, event?: string | Buffer): Promise<any>;
    checkIfFunctionExist(serviceName: string, functionName: string): Promise<boolean>;
}
