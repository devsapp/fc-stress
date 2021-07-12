"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var base_1 = __importDefault(require("./common/base"));
var logger_1 = __importDefault(require("./common/logger"));
var _ = __importStar(require("lodash"));
var core = __importStar(require("@serverless-devs/core"));
var stdout_formatter_1 = __importDefault(require("./lib/component/stdout-formatter"));
var stress_1 = require("./lib/stress");
var file_1 = require("./lib/utils/file");
var static_1 = require("./lib/static");
var FcStressComponent = /** @class */ (function (_super) {
    __extends(FcStressComponent, _super);
    function FcStressComponent(props) {
        return _super.call(this, props) || this;
    }
    FcStressComponent.prototype.report = function (componentName, command, accountID, access) {
        return __awaiter(this, void 0, void 0, function () {
            var uid, credentials, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        uid = accountID;
                        if (!_.isEmpty(accountID)) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, core.getCredential(access)];
                    case 2:
                        credentials = _a.sent();
                        uid = credentials.AccountID;
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        logger_1.default.warning(stdout_formatter_1.default.stdoutFormatter.warn('get credential', "failed, access is: " + access));
                        logger_1.default.debug("Get credentials error: " + e_1);
                        return [3 /*break*/, 4];
                    case 4:
                        core.reportComponent(componentName, {
                            command: command,
                            uid: uid,
                        }).catch(function (e) {
                            logger_1.default.warning(stdout_formatter_1.default.stdoutFormatter.warn('component report', "failed, component name: " + componentName + ", method: " + command));
                            logger_1.default.debug("Report component error: " + e);
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    FcStressComponent.prototype.argsParser = function (inputs) {
        var apts = {
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
                'assume-yes': 'y'
            },
        };
        var comParse = core.commandParse(inputs, apts);
        // 将Args转成Object
        comParse.data = comParse.data || {};
        var _a = comParse.data, region = _a.region, access = _a.access, qualifier = _a.qualifier, url = _a.url, method = _a.method, payload = _a.payload, help = _a.help;
        var functionName = comParse.data['function-name'];
        var serviceName = comParse.data['service-name'];
        var functionType = comParse.data['function-type'];
        var assumeYes = comParse.data['assume-yes'];
        var numUser = _.toInteger(comParse.data['num-user']);
        var spawnRate = _.toInteger(comParse.data['spawn-rate']);
        var runningTime = _.toInteger(comParse.data['run-time']);
        var payloadFile = comParse.data['payload-file'];
        return {
            region: region, access: access, qualifier: qualifier, url: url, method: method,
            payload: payload, help: help, functionName: functionName, serviceName: serviceName, functionType: functionType,
            numUser: numUser, spawnRate: spawnRate, runningTime: runningTime, payloadFile: payloadFile, assumeYes: assumeYes
        };
    };
    /**
     * start stress test
     * @param inputs
     * @returns
     */
    FcStressComponent.prototype.start = function (inputs) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var _c, region, access, qualifier, url, method, payload, help, functionName, serviceName, functionType, numUser, spawnRate, runningTime, payloadFile, creds, serverlessProfile, stressOpts, payloadContent, httpTypeOpts, eventTypeOpts, fcStress, invokeRes, stressVm, e_2, data;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, stdout_formatter_1.default.initStdout()];
                    case 1:
                        _d.sent();
                        _c = this.argsParser(inputs), region = _c.region, access = _c.access, qualifier = _c.qualifier, url = _c.url, method = _c.method, payload = _c.payload, help = _c.help, functionName = _c.functionName, serviceName = _c.serviceName, functionType = _c.functionType, numUser = _c.numUser, spawnRate = _c.spawnRate, runningTime = _c.runningTime, payloadFile = _c.payloadFile;
                        return [4 /*yield*/, this.report('fc-stress', 'stress', null, access)];
                    case 2:
                        _d.sent();
                        if (help) {
                            core.help(static_1.START_HELP_INFO);
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, core.getCredential(access)];
                    case 3:
                        creds = _d.sent();
                        serverlessProfile = {
                            project: {
                                access: access,
                                projectName: (_a = inputs === null || inputs === void 0 ? void 0 : inputs.project) === null || _a === void 0 ? void 0 : _a.projectName
                            },
                            appName: inputs === null || inputs === void 0 ? void 0 : inputs.appName
                        };
                        stressOpts = {
                            numUser: numUser,
                            spawnRate: spawnRate,
                            runningTime: runningTime,
                            functionType: functionType
                        };
                        logger_1.default.info("Reading payload content...");
                        return [4 /*yield*/, file_1.payloadPriority(payload, payloadFile)];
                    case 4:
                        payloadContent = _d.sent();
                        httpTypeOpts = null;
                        eventTypeOpts = null;
                        if (functionType === 'event') {
                            eventTypeOpts = Object.assign({}, {
                                serviceName: serviceName,
                                functionName: functionName,
                                qualifier: qualifier || "LATEST",
                                payload: payloadContent
                            });
                        }
                        else if (functionType === 'http') {
                            httpTypeOpts = Object.assign({}, {
                                url: url,
                                method: method,
                                body: payloadContent
                            });
                        }
                        fcStress = new stress_1.FcStress(serverlessProfile, creds, region, stressOpts, httpTypeOpts, eventTypeOpts, (_b = inputs === null || inputs === void 0 ? void 0 : inputs.path) === null || _b === void 0 ? void 0 : _b.configPath);
                        if (!fcStress.validate()) {
                            return [2 /*return*/];
                        }
                        // 部署辅助函数
                        logger_1.default.info("Preparing helper reource for stress test.");
                        return [4 /*yield*/, fcStress.init()];
                    case 5:
                        _d.sent();
                        stressVm = core.spinner("Stress test...");
                        _d.label = 6;
                    case 6:
                        _d.trys.push([6, 8, , 9]);
                        return [4 /*yield*/, fcStress.invoke()];
                    case 7:
                        invokeRes = _d.sent();
                        stressVm.succeed("Stress test complete.");
                        return [3 /*break*/, 9];
                    case 8:
                        e_2 = _d.sent();
                        stressVm.fail("Stress test error.");
                        throw e_2;
                    case 9:
                        data = invokeRes === null || invokeRes === void 0 ? void 0 : invokeRes.data;
                        if (_.isString(data)) {
                            data = JSON.parse(data);
                        }
                        fcStress.processError(data);
                        logger_1.default.info("Displaying the result of stress test.");
                        return [4 /*yield*/, fcStress.showHtmlReport(data)];
                    case 10:
                        _d.sent();
                        delete data.report_html;
                        return [2 /*return*/, data];
                }
            });
        });
    };
    /**
     * clean stress helper function and html report file
     * @param inputs
     * @returns
     */
    FcStressComponent.prototype.clean = function (inputs) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var _c, region, access, help, assumeYes, creds, serverlessProfile, fcStress;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _c = this.argsParser(inputs), region = _c.region, access = _c.access, help = _c.help, assumeYes = _c.assumeYes;
                        return [4 /*yield*/, core.getCredential(access)];
                    case 1:
                        creds = _d.sent();
                        return [4 /*yield*/, this.report('fc-stress', 'clean', null, access)];
                    case 2:
                        _d.sent();
                        if (help) {
                            core.help(static_1.CLEAN_HELP_INFO);
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, stdout_formatter_1.default.initStdout()];
                    case 3:
                        _d.sent();
                        serverlessProfile = {
                            project: {
                                access: access,
                                projectName: (_a = inputs === null || inputs === void 0 ? void 0 : inputs.project) === null || _a === void 0 ? void 0 : _a.projectName
                            },
                            appName: inputs === null || inputs === void 0 ? void 0 : inputs.appName
                        };
                        fcStress = new stress_1.FcStress(serverlessProfile, creds, region, null, null, null, (_b = inputs === null || inputs === void 0 ? void 0 : inputs.path) === null || _b === void 0 ? void 0 : _b.configPath);
                        logger_1.default.info("Cleaning helper resource and local html report files...");
                        return [4 /*yield*/, fcStress.clean(assumeYes)];
                    case 4:
                        _d.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return FcStressComponent;
}(base_1.default));
exports.default = FcStressComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHVEQUEwQztBQUMxQywyREFBcUM7QUFFckMsd0NBQTRCO0FBQzVCLDBEQUE4QztBQUM5QyxzRkFBK0Q7QUFDL0QsdUNBQXdDO0FBR3hDLHlDQUFtRDtBQUNuRCx1Q0FBZ0U7QUFFaEU7SUFBK0MscUNBQWE7SUFDMUQsMkJBQVksS0FBSztlQUNmLGtCQUFNLEtBQUssQ0FBQztJQUNkLENBQUM7SUFDYSxrQ0FBTSxHQUFwQixVQUFxQixhQUFxQixFQUFFLE9BQWUsRUFBRSxTQUFrQixFQUFFLE1BQWU7Ozs7Ozt3QkFDMUYsR0FBRyxHQUFXLFNBQVMsQ0FBQzs2QkFDeEIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBcEIsd0JBQW9COzs7O3dCQUVjLHFCQUFNLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLEVBQUE7O3dCQUE1RCxXQUFXLEdBQWlCLFNBQWdDO3dCQUNsRSxHQUFHLEdBQUcsV0FBVyxDQUFDLFNBQVMsQ0FBQzs7Ozt3QkFFNUIsZ0JBQU0sQ0FBQyxPQUFPLENBQUMsMEJBQWUsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLHdCQUFzQixNQUFRLENBQUMsQ0FBQyxDQUFDO3dCQUN2RyxnQkFBTSxDQUFDLEtBQUssQ0FBQyw0QkFBMEIsR0FBRyxDQUFDLENBQUM7Ozt3QkFJaEQsSUFBSSxDQUFDLGVBQWUsQ0FBQyxhQUFhLEVBQUU7NEJBQ2xDLE9BQU8sU0FBQTs0QkFDUCxHQUFHLEtBQUE7eUJBQ0osQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFDLENBQUM7NEJBQ1QsZ0JBQU0sQ0FBQyxPQUFPLENBQUMsMEJBQWUsQ0FBQyxlQUFlLENB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