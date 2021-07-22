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
var try_require_1 = __importDefault(require("try-require"));
var silly_datetime_1 = __importDefault(require("silly-datetime"));
var pkg = try_require_1.default(path.join(__dirname, '..', '..', 'package.json'));
var VERSION = (pkg === null || pkg === void 0 ? void 0 : pkg.version) || '0.0.0';
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
                    case 0: return [4 /*yield*/, fse.ensureDir(path.dirname(FcStress.helperFunctionDeployedRegionFile))];
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
                        curTimestamp = silly_datetime_1.default.format(new Date(), 'YYYY-MM-DDTHH-mm-ss');
                        if (this.isEventFunctionType()) {
                            cacheHtmlFileName = this.eventTypeOpts.serviceName + "." + this.eventTypeOpts.qualifier + "-" + this.eventTypeOpts.functionName + "#" + curTimestamp + ".html";
                        }
                        else if (this.isHttpFunctionType()) {
                            cacheHtmlFileName = "url#" + curTimestamp + ".html";
                        }
                        cacheHtmlFilePath = path.join(FcStress.defaultHtmlCacheDir, cacheHtmlFileName || '');
                        return [4 /*yield*/, fse.writeFile(cacheHtmlFilePath, htmlContent, { flag: 'w' })];
                    case 2:
                        _a.sent();
                        logger_1.default.log("Html report flie: " + cacheHtmlFilePath + "\nExecute 'open " + cacheHtmlFilePath + "' on macos for html report with browser.", 'yellow');
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
        if (lodash_1.default.isString(data) && lodash_1.default.toLower(data).includes('error')) {
            throw new Error(data);
        }
    };
    FcStress.supportedFunctionTypes = ['event', 'http'];
    FcStress.defaultCacheDir = path.join(os_1.default.homedir(), '.s', 'cache', 'fc-stress');
    FcStress.defaultVersionCacheDir = path.join(FcStress.defaultCacheDir, VERSION);
    FcStress.defaultHtmlCacheDir = path.join(FcStress.defaultCacheDir, 'html');
    // 辅助函数被部署过的 region 列表，表示在目标 region 已经部署过该版本组件对应的辅助函数
    FcStress.helperFunctionDeployedRegionFile = path.join(FcStress.defaultVersionCacheDir, 'region.json');
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
            PYTHONUSERBASE: "/code/.s/python",
            TZ: "Asia/Shanghai"
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2xpYi9zdHJlc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSwyQkFBZ0M7QUFDaEMseUNBQTZCO0FBQzdCLHVDQUErQztBQUMvQyxxQ0FBK0U7QUFDL0UsMERBQThDO0FBQzlDLDREQUFzQztBQUN0Qyw0Q0FBZ0M7QUFDaEMsMENBQW9CO0FBQ3BCLDRDQUFnQztBQUNoQyxrRkFBMkQ7QUFFM0QseUNBQTBEO0FBQzFELGtEQUF1QjtBQUN2Qiw2Q0FBaUM7QUFDakMsNERBQXFDO0FBQ3JDLGtFQUFnQztBQUNoQyxJQUFNLEdBQUcsR0FBRyxxQkFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsY0FBYyxDQUFDLENBQUMsQ0FBQztBQUN6RSxJQUFNLE9BQU8sR0FBVyxDQUFBLEdBQUcsYUFBSCxHQUFHLHVCQUFILEdBQUcsQ0FBRSxPQUFPLEtBQUksT0FBTyxDQUFDO0FBRWhEO0lBQThCLDRCQUFXO0lBbUN2QyxrQkFBWSxpQkFBb0MsRUFBRSxLQUFtQixFQUFFLE1BQWMsRUFBRSxVQUF5QixFQUFFLFlBQTZCLEVBQUUsYUFBK0IsRUFBRSxPQUFnQixFQUFFLElBQWE7UUFBak4sWUFDRSxrQkFBTSxpQkFBaUIsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsU0FZdkQ7UUFWQyxLQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztRQUM3QixJQUFJLEtBQUksQ0FBQyxVQUFVLEVBQUU7WUFDbkIsS0FBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLElBQUksUUFBUSxDQUFDLGlCQUFpQixDQUFDLE9B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