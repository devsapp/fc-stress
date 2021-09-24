export declare const START_HELP_INFO: ({
    header: string;
    content: string;
    optionList?: undefined;
} | {
    header: string;
    optionList: ({
        name: string;
        typeLabel: string;
        description: string;
        type: NumberConstructor;
        alias?: undefined;
    } | {
        name: string;
        typeLabel: string;
        description: string;
        type: StringConstructor;
        alias?: undefined;
    } | {
        name: string;
        typeLabel: string;
        description: string;
        alias: string;
        type: StringConstructor;
    })[];
    content?: undefined;
} | {
    header: string;
    optionList: ({
        name: string;
        typeLabel: string;
        description: string;
        alias: string;
        type: StringConstructor;
    } | {
        name: string;
        description: string;
        alias: string;
        type: BooleanConstructor;
        typeLabel?: undefined;
    })[];
    content?: undefined;
} | {
    header: string;
    content: string[];
    optionList?: undefined;
})[];
export declare const CLEAN_HELP_INFO: ({
    header: string;
    content: string;
    optionList?: undefined;
} | {
    header: string;
    optionList: ({
        name: string;
        typeLabel: string;
        description: string;
        alias: string;
        type: StringConstructor;
    } | {
        name: string;
        description: string;
        alias: string;
        type: BooleanConstructor;
        typeLabel?: undefined;
    })[];
    content?: undefined;
} | {
    header: string;
    content: string[];
    optionList?: undefined;
})[];
