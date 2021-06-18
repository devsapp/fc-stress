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
exports.FcStress = void 0;
var fc_1 = require("./fc");
var path = __importStar(require("path"));
var ram_1 = require("./component/ram");
var profile_1 = require("./profile");
var core = __importStar(require("@serverless-devs/core"));
var logger_1 = __importDefault(require("../common/logger"));
var yaml = __importStar(require("js-yaml"));
var os_1 = __importDefault(require("os"));
var fse = __importStar(require("fs-extra"));
var stdout_formatter_1 = __importDefault(require("./component/stdout-formatter"));
var prompt_1 = require("./utils/prompt");
var lodash_1 = __importDefault(require("lodash"));
var rimraf = __importStar(require("rimraf"));
var FcStress = /** @class */ (function (_super) {
    __extends(FcStress, _super);
    function FcStress(serverlessProfile, creds, region, stressOpts, httpTypeOpts, eventTypeOpts, curPath, args) {
        var _this = _super.call(this, serverlessProfile, region, creds, curPath, args) || this;
        _this.stressOpts = stressOpts;
        if (_this.stressOpts) {
            _this.stressOpts.numUser = _this.stressOpts.numUser || FcStress.defaultStressOpts.numUser;
            _this.stressOpts.spawnRate = _this.stressOpts.spawnRate || FcStress.defaultStressOpts.spawnRate;
            _this.stressOpts.runningTime = _this.stressOpts.runningTime || FcStress.defaultStressOpts.runningTime;
            logger_1.default.info(stdout_formatter_1.default.stdoutFormatter.using('stress options', "\n" + yaml.dump(_this.stressOpts)));
        }
        _this.httpTypeOpts = httpTypeOpts;
        _this.eventTypeOpts = eventTypeOpts;
        _this.fcClient = new fc_1.FcClient(_this.region, _this.credentials);
        return _this;
    }
    FcStress.prototype.validate = function () {
        if (this.stressOpts) {
            var functionType = this.stressOpts.functionType;
            if (!functionType) {
                logger_1.default.error("Please input function type!");
                return false;
            }
            if (!lodash_1.default.includes(FcStress.supportedFunctionTypes, functionType)) {
                logger_1.default.error("Unsupported function type: " + functionType);
                return false;
            }
        }
        return true;
    };
    FcStress.prototype.makeHelperFunction = function (roleArn) {
        return __awaiter(this, void 0, void 0, function () {
            var defaultServiceProp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        defaultServiceProp = {
                            serviceName: FcStress.defaultServiceName,
                            role: roleArn
                        };
                        return [4 /*yield*/, this.fcClient.makeService(defaultServiceProp)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.fcClient.makeFunction(FcStress.defaultFunctionProp)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    FcStress.prototype.removeHelperFunction = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fcClient.removeFunction(FcStress.defaultServiceName, FcStress.defaultFunctionProp.functionName)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.fcClient.removeService(FcStress.defaultServiceName)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    FcStress.prototype.makeServiceRole = function () {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var profileOfRam, ramComponent, ramComponentInputs, ramComponentIns, roleArn;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        logger_1.default.debug(stdout_formatter_1.default.stdoutFormatter.set('role for helper service', FcStress.defaultRoleName));
                        profileOfRam = profile_1.replaceProjectName(this.serverlessProfile, ((_b = (_a = this.serverlessProfile) === null || _a === void 0 ? void 0 : _a.project) === null || _b === void 0 ? void 0 : _b.projectName) + "-ram-project");
                        ramComponent = new ram_1.RamComponent(profileOfRam, {
                            roleName: FcStress.defaultRoleName,
                            resourceName: "fc.aliyuncs.com",
                            assumeRolePolicy: null,
                            attachedPolicies: ['AliyunFCInvocationAccess'],
                            description: "Default role generated by fc-stress component",
                        }, this.region, this.credentials, this.curPath, this.args);
                        ramComponentInputs = ramComponent.genComponentInputs('ram');
                        return [4 /*yield*/, core.load('devsapp/ram')];
                    case 1:
                        ramComponentIns = _c.sent();
                        return [4 /*yield*/, ramComponentIns.deploy(ramComponentInputs)];
                    case 2:
                        roleArn = _c.sent();
                        return [2 /*return*/, roleArn];
                }
            });
        });
    };
    FcStress.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var roleArn;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.checkIfNecessaryToDeployHelper()];
                    case 1:
                        if (!_a.sent()) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.makeServiceRole()];
                    case 2:
                        roleArn = _a.sent();
                        // 部署辅助函数
                        return [4 /*yield*/, this.makeHelperFunction(roleArn)];
                    case 3:
                        // 部署辅助函数
                        _a.sent();
                        return [4 /*yield*/, this.makeHelpFunctionDeployedRegionFile()];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    FcStress.prototype.checkIfNecessaryToDeployHelper = function () {
        return __awaiter(this, void 0, void 0, function () {
            var regionList, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.fcClient.checkIfFunctionExist(FcStress.defaultServiceName, FcStress.defaultFunctionProp.functionName)];
                    case 1:
                        /*
                        两种情况需要部署辅助函数:
                        1. 线上辅助资源不存在
                        2. 该版本组件对应的辅助函数未被部署过
                        */
                        if (!(_c.sent())) {
                            logger_1.default.debug("Helper function not exist online.");
                            return [2 /*return*/, true];
                        }
                        return [4 /*yield*/, fse.pathExists(FcStress.helperFunctionDeployedRegionFile)];
                    case 2:
                        if (!(_c.sent())) {
                            logger_1.default.debug(FcStress.helperFunctionDeployedRegionFile + " not exist.");
                            return [2 /*return*/, true];
                        }
                        _b = (_a = JSON).parse;
                        return [4 /*yield*/, fse.readFile(FcStress.helperFunctionDeployedRegionFile, { encoding: 'utf-8', })];
                    case 3:
                        regionList = _b.apply(_a, [_c.sent()]);
                        logger_1.default.debug("Deployed region list: " + regionList);
                        if (!lodash_1.default.includes(regionList, this.region)) {
                            logger_1.default.debug("The version of helper function has not been deployed in the region: " + this.region);
                            return [2 /*return*/, true];
                        }
                        return [2 /*return*/, false];
                }
            });
        });
    };
    FcStress.prototype.makeHelpFunctionDeployedRegionFile = function () {
        return __awaiter(this, void 0, void 0, function () {
            var regionList, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, fse.ensureDir(FcStress.defaultCacheDir)];
                    case 1:
                        _c.sent();
                        regionList = [];
                        return [4 /*yield*/, fse.pathExists(FcStress.helperFunctionDeployedRegionFile)];
                    case 2:
                        if (!_c.sent()) return [3 /*break*/, 4];
                        _b = (_a = JSON).parse;
                        return [4 /*yield*/, fse.readFile(FcStress.helperFunctionDeployedRegionFile, { encoding: 'utf-8', })];
                    case 3:
                        // append
                        regionList = _b.apply(_a, [_c.sent()]);
                        _c.label = 4;
                    case 4:
                        regionList.push(this.region);
                        logger_1.default.debug("Newly region list: " + regionList);
                        return [4 /*yield*/, fse.writeFile(FcStress.helperFunctionDeployedRegionFile, JSON.stringify(regionList), { flag: 'w', mode: 511 })];
                    case 5:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    FcStress.prototype.invoke = function () {
        return __awaiter(this, void 0, void 0, function () {
            var event, invokeRes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        event = {
                            NUM_USERS: this.stressOpts.numUser,
                            SPAWN_RATE: this.stressOpts.spawnRate,
                            RUN_TIME: this.stressOpts.runningTime,
                            REPORT_HTML: true,
                            functionType: this.stressOpts.functionType,
                        };
                        if (this.isEventFunctionType()) {
                            Object.assign(event, this.eventTypeOpts);
                        }
                        else if (this.isHttpFunctionType) {
                            Object.assign(event, this.httpTypeOpts);
                        }
                        logger_1.default.debug("Event of invoking function is: \n" + yaml.dump(event));
                        return [4 /*yield*/, this.fcClient.invokeFunction(FcStress.defaultServiceName, FcStress.defaultFunctionProp.functionName, JSON.stringify(event))];
                    case 1:
                        invokeRes = _a.sent();
                        return [2 /*return*/, invokeRes];
                }
            });
        });
    };
    FcStress.prototype.isEventFunctionType = function () {
        return this.stressOpts.functionType === 'event';
    };
    FcStress.prototype.isHttpFunctionType = function () {
        return this.stressOpts.functionType === 'http';
    };
    FcStress.prototype.showHtmlReport = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var htmlContent, cacheHtmlFileName, curTimestamp, cacheHtmlFilePath;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        htmlContent = data.report_html;
                        return [4 /*yield*/, fse.ensureDir(FcStress.defaultHtmlCacheDir)];
                    case 1:
                        _a.sent();
                        curTimestamp = new Date().toISOString();
                        if (this.isEventFunctionType()) {
                            cacheHtmlFileName = this.eventTypeOpts.serviceName + "." + this.eventTypeOpts.qualifier + "-" + this.eventTypeOpts.functionName + "#" + curTimestamp + ".html";
                        }
                        else if (this.isHttpFunctionType()) {
                            cacheHtmlFileName = "url#" + curTimestamp;
                        }
                        cacheHtmlFilePath = path.join(FcStress.defaultHtmlCacheDir, cacheHtmlFileName || '');
                        return [4 /*yield*/, fse.writeFile(cacheHtmlFilePath, htmlContent, { mode: 511, flag: 'w' })];
                    case 2:
                        _a.sent();
                        logger_1.default.log("Html report flie: " + cacheHtmlFilePath + "\nOpen it for html report with browser.", 'yellow');
                        return [2 /*return*/];
                }
            });
        });
    };
    FcStress.prototype.clean = function (assumeYes) {
        return __awaiter(this, void 0, void 0, function () {
            var msg, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: 
                    // 删除辅助函数
                    return [4 /*yield*/, this.removeHelperFunction()];
                    case 1:
                        // 删除辅助函数
                        _b.sent();
                        msg = "Are you sure to remove all the history html report files under " + FcStress.defaultHtmlCacheDir + "?";
                        _a = assumeYes;
                        if (_a) return [3 /*break*/, 3];
                        return [4 /*yield*/, prompt_1.promptForConfirmContinue(msg)];
                    case 2:
                        _a = (_b.sent());
                        _b.label = 3;
                    case 3:
                        if (_a) {
                            rimraf.sync(FcStress.defaultHtmlCacheDir);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    FcStress.prototype.processError = function (data) {
        if (data === null || data === void 0 ? void 0 : data.errorMessage) {
            if (data === null || data === void 0 ? void 0 : data.errorMessage.includes("[Errno 2] No such file or directory: '/tmp/report.html'")) {
                throw new Error("Invalid format of payload.");
            }
            throw new Error("Helper function error type: " + (data === null || data === void 0 ? void 0 : data.errorType) + ", error message: " + (data === null || data === void 0 ? void 0 : data.errorMessage));
        }
    };
    FcStress.supportedFunctionTypes = ['event', 'http'];
    FcStress.defaultCacheDir = path.join(os_1.default.homedir(), '.s', 'cache', 'fc-stress');
    FcStress.defaultHtmlCacheDir = path.join(FcStress.defaultCacheDir, 'html');
    // 辅助函数被部署过的 region 列表，表示在目标 region 已经部署过该版本组件对应的辅助函数
    FcStress.helperFunctionDeployedRegionFile = path.join(FcStress.defaultCacheDir, 'region.json');
    FcStress.defaultServiceName = "_DEFAULT_FC_STRESS_COMPONENT_SERVICE";
    FcStress.defaultRoleName = "DEFAULT-FC-STRESS-COMPONENT-ROLE";
    FcStress.defaultFunctionProp = {
        functionName: "_DEFAULT_FC_STRESS_COMPONENT_SERVICE",
        serviceName: FcStress.defaultServiceName,
        handler: 'index.handler',
        runtime: 'python3',
        codeUri: path.join(__dirname, 'utils', 'stress_test', 'code.zip'),
        memorySize: 3072,
        timeout: 600,
        environmentVariables: {
            PATH: "/code/.s/root/usr/local/bin:/code/.s/root/usr/local/sbin:/code/.s/root/usr/bin:/code/.s/root/usr/sbin:/code/.s/root/sbin:/code/.s/root/bin:/code:/code/node_modules/.bin:/code/.s/python/bin:/code/.s/node_modules/.bin:/usr/local/bin:/usr/local/sbin:/usr/bin:/usr/sbin:/sbin:/bin",
            PYTHONUSERBASE: "/code/.s/python"
        }
    };
    FcStress.defaultStressOpts = {
        functionType: '',
        numUser: 6,
        spawnRate: 10,
        runningTime: 30
    };
    return FcStress;
}(profile_1.IInputsBase));
exports.FcStress = FcStress;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2xpYi9zdHJlc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSwyQkFBZ0M7QUFDaEMseUNBQTZCO0FBQzdCLHVDQUErQztBQUMvQyxxQ0FBK0U7QUFDL0UsMERBQThDO0FBQzlDLDREQUFzQztBQUN0Qyw0Q0FBZ0M7QUFDaEMsMENBQW9CO0FBQ3BCLDRDQUFnQztBQUNoQyxrRkFBMkQ7QUFFM0QseUNBQTBEO0FBQzFELGtEQUF1QjtBQUN2Qiw2Q0FBaUM7QUFFakM7SUFBOEIsNEJBQVc7SUFpQ3ZDLGtCQUFZLGlCQUFvQyxFQUFFLEtBQW1CLEVBQUUsTUFBYyxFQUFFLFVBQXlCLEVBQUUsWUFBNkIsRUFBRSxhQUErQixFQUFFLE9BQWdCLEVBQUUsSUFBYTtRQUFqTixZQUNFLGtCQUFNLGlCQUFpQixFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxTQVl2RDtRQVZDLEtBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO1FBQzdCLElBQUksS0FBSSxDQUFDLFVBQVUsRUFBRTtZQUNuQixLQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sSUFBSSxRQUFRLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDO1lBQ3hGLEtBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxJQUFJLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLENBQUM7WUFDOUYsS0FBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLElBQUksUUFBUSxDQUFDLGlCQUFpQixDQUFDLFdBQVcsQ0FBQztZ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