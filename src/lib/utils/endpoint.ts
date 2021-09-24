import * as core from '@serverless-devs/core';

export async function getEndpointFromFcDefault(): Promise<string | null> {
  const fcDefault = await core.loadComponent('devsapp/fc-default');
  const fcEndpoint: string = await fcDefault.get({ args: 'fc-endpoint' });
  if (!fcEndpoint) { return null; }
  const enableFcEndpoint: any = await fcDefault.get({ args: 'enable-fc-endpoint' });
  return (enableFcEndpoint === true || enableFcEndpoint === 'true') ? fcEndpoint : null;
}
