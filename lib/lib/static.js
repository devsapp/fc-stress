"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLEAN_HELP_INFO = exports.START_HELP_INFO = void 0;
exports.START_HELP_INFO = [
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
            "$ s cli fc-stress --num-user 6 --spawn-rate 10 --run-time 30 --function-type event --service-name myService --function-name myFunction --qualifier myQualifier --payload \"hello world\" --region myRegion --access myAccess",
            "$ s cli fc-stress --num-user 6 --spawn-rate 10 --run-time 30 --function-type http --url myUrl --method POST --payload \"hello world\" --region myRegion --access myAccess",
        ],
    },
];
exports.CLEAN_HELP_INFO = [
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
            "$ s cli fc-stress clean --region myRegion --access myAccess -y",
        ],
    },
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGljLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2xpYi9zdGF0aWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRWEsUUFBQSxlQUFlLEdBQUc7SUFDN0I7UUFDRSxNQUFNLEVBQUUsUUFBUTtRQUNoQixPQUFPLEVBQUUsbUJBQW1CO0tBQzdCO0lBQ0Q7UUFDRSxNQUFNLEVBQUUsT0FBTztRQUNmLE9BQU8sRUFBRSxtQ0FBbUM7S0FDN0M7SUFDRDtRQUNFLE1BQU0sRUFBRSxTQUFTO1FBQ2pCLFVBQVUsRUFBRTtZQUNWO2dCQUNFLElBQUksRUFBRSxVQUFVO2dCQUNoQixTQUFTLEVBQUUscUJBQXFCO2dCQUNoQyxXQUFXLEVBQUUsZ0NBQWdDO2dCQUM3QyxJQUFJLEVBQUUsTUFBTTthQUNiO1lBQ0Q7Z0JBQ0UsSUFBSSxFQUFFLFlBQVk7Z0JBQ2xCLFNBQVMsRUFBRSx1QkFBdUI7Z0JBQ2xDLFdBQVcsRUFBRSx3Q0FBd0M7Z0JBQ3JELElBQUksRUFBRSxNQUFNO2FBQ2I7WUFDRDtnQkFDRSxJQUFJLEVBQUUsVUFBVTtnQkFDaEIsU0FBUyxFQUFFLGtCQUFrQjtnQkFDN0IsV0FBVyxFQUFFLHVCQUF1QjtnQkFDcEMsSUFBSSxFQUFFLE1BQU07YUFDYjtZQUNEO2dCQUNFLElBQUksRUFBRSxlQUFlO2dCQUNyQixTQUFTLEVBQUUsMEJBQTBCO2dCQUNyQyxXQUFXLEVBQUUsd0RBQXdEO2dCQUNyRSxJQUFJLEVBQUUsTUFBTTthQUNiO1lBQ0Q7Z0JBQ0UsSUFBSSxFQUFFLGNBQWM7Z0JBQ3BCLFNBQVMsRUFBRSx5QkFBeUI7Z0JBQ3BDLFdBQVcsRUFBRSxpREFBaUQ7Z0JBQzlELElBQUksRUFBRSxNQUFNO2FBQ2I7WUFDRDtnQkFDRSxJQUFJLEVBQUUsZUFBZTtnQkFDckIsU0FBUyxFQUFFLDBCQUEwQjtnQkFDckMsV0FBVyxFQUFFLGtEQUFrRDtnQkFDL0QsSUFBSSxFQUFFLE1BQU07YUFDYjtZQUNEO2dCQUNFLElB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