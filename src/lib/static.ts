

export const START_HELP_INFO = [
  {
    header: 'Stress',
    content: 'Start stress test',
  },
  {
    header: 'Usage',
    content: '$ s cli fc-stress start <options>',
  },
  {
    header: 'Options',
    optionList: [
      {
        name: 'num-user',
        typeLabel: '{underline numUser}',
        description: 'Number of the simulated users.',
        type: Number,
      },
      {
        name: 'spawn-rate',
        typeLabel: '{underline spawnRate}',
        description: 'Increasing number of users per second.',
        type: Number,
      },
      {
        name: 'run-time',
        typeLabel: '{underline time}',
        description: 'Intervals for stress.',
        type: Number,
      },
      {
        name: 'function-type',
        typeLabel: '{underline functionType}',
        description: 'Type of the target function, including event and http.',
        type: String,
      },
      {
        name: 'service-name',
        typeLabel: '{underline serviceName}',
        description: 'Target service, only for --function-type event.',
        type: String,
      },
      {
        name: 'function-name',
        typeLabel: '{underline functionName}',
        description: 'Target function, only for --function-type event.',
        type: String,
      },
      {
        name: 'qualifier',
        typeLabel: '{underline qualifier}',
        description: 'Qualifier of the target function, only for --function-type event.',
        alias: 'q',
        type: String,
      },
      {
        name: 'url',
        typeLabel: '{underline url}',
        description: 'Target url, only for --function-type http.',
        alias: 'u',
        type: String,
      },
      {
        name: 'method',
        typeLabel: '{underline method}',
        description: 'Target method, only for --function-type http.',
        alias: 'm',
        type: String,
      },
      {
        name: 'payload',
        typeLabel: '{underline payload}',
        description: 'For --function-type event, represents the event passed to the function;\nFor --function-type http, represents the request body passed to the function.',
        alias: 'p',
        type: String,
      },
      {
        name: 'payload-file',
        typeLabel: '{underline path}',
        description: 'For --function-type event, contains the event passed to the function;\nFor --function-type http, contains the request body passed to the function.',
        alias: 'f',
        type: String,
      },
    ],
  },
  {
    header: 'Global Options',
    optionList: [
      {
        name: 'region',
        typeLabel: '{underline region}',
        description: 'Target region.',
        alias: 'r',
        type: String,
      },
      {
        name: 'access',
        typeLabel: '{underline access}',
        description: 'Specify key alias.',
        alias: 'a',
        type: String,
      },
      {
        name: 'help',
        description: 'Display help for command.',
        alias: 'h',
        type: Boolean,
      },
    ],
  },
  {
    header: 'Examples with CLI',
    content: [
      '$ s cli fc-stress start --num-user 6 --spawn-rate 10 --run-time 30 --function-type event --service-name myService --function-name myFunction --qualifier myQualifier --payload "hello world" --region myRegion --access myAccess',
      '$ s cli fc-stress start --num-user 6 --spawn-rate 10 --run-time 30 --function-type http --url myUrl --method POST --payload "hello world" --region myRegion --access myAccess',
    ],
  },
];

export const CLEAN_HELP_INFO = [
  {
    header: 'Clean',
    content: 'Clean the relevant resources',
  },
  {
    header: 'Usage',
    content: '$ s cli fc-stress clean <options>',
  },
  {
    header: 'Options',
    optionList: [
      {
        name: 'assume-yes',
        description: 'Number of the simulated users.',
        alias: 'y',
        type: Boolean,
      },
    ],
  },
  {
    header: 'Global Options',
    optionList: [
      {
        name: 'region',
        typeLabel: '{underline region}',
        description: 'Target region.',
        alias: 'r',
        type: String,
      },
      {
        name: 'access',
        typeLabel: '{underline access}',
        description: 'Specify key alias.',
        alias: 'a',
        type: String,
      },
      {
        name: 'help',
        description: 'Display help for command.',
        alias: 'h',
        type: Boolean,
      },
    ],
  },
  {
    header: 'Examples with CLI',
    content: [
      '$ s cli fc-stress clean --region myRegion --access myAccess -y',
    ],
  },
];
