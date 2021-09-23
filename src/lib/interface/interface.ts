export interface StressOption {
  numUser?: number;
  spawnRate?: number;
  runningTime?: number;
  functionType: string;
  invocationType?: string;
}
export interface HttpTypeOption {
  url: number;
  method?: string;
  body?: any;
}
export interface EventTypeOption {
  serviceName: string;
  functionName: string;
  qualifier?: string;
  payload?: any;
}
