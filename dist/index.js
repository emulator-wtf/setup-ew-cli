"use strict";
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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var process_1 = require("process");
var core_1 = require("@actions/core");
var exec_1 = require("@actions/exec");
var tool_cache_1 = require("@actions/tool-cache");
var EW_CLI_URL = "https://maven.emulator.wtf/releases/ew-cli";
function setup() {
    return __awaiter(this, void 0, void 0, function () {
        var version, binPath, executable, cachedCli, path, cachedJar, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 10, , 11]);
                    version = (0, core_1.getInput)('version');
                    (0, core_1.exportVariable)('EW_VERSION', version);
                    binPath = "".concat(process_1.env.HOME, "/.cache/emulator-wtf/bin");
                    (0, core_1.debug)("Creating ".concat(binPath));
                    return [4, fs_1.promises.mkdir(binPath, { recursive: true })];
                case 1:
                    _a.sent();
                    executable = "".concat(binPath, "/ew-cli");
                    if (!!(0, fs_1.existsSync)(executable)) return [3, 6];
                    (0, core_1.debug)("".concat(executable, " doesn't exist, looking in cache"));
                    cachedCli = (0, tool_cache_1.find)('emulatorwtf-wrapper', version);
                    if (!!cachedCli) return [3, 4];
                    (0, core_1.debug)("ew-cli not found in cache, downloading....");
                    return [4, (0, tool_cache_1.downloadTool)(EW_CLI_URL)];
                case 2:
                    path = _a.sent();
                    (0, tool_cache_1.cacheFile)(path, 'ew-cli', 'emulatorwtf-wrapper', version);
                    return [4, fs_1.promises.copyFile(path, executable)];
                case 3:
                    _a.sent();
                    return [3, 6];
                case 4:
                    (0, core_1.debug)("ew-cli not found in cache!");
                    return [4, fs_1.promises.copyFile(cachedCli, executable)];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6:
                    (0, fs_1.chmodSync)(executable, "755");
                    (0, core_1.addPath)(binPath);
                    cachedJar = (0, tool_cache_1.find)('emulatorwtf-jar', version);
                    (0, core_1.debug)("looking for jar in cache!");
                    if (!cachedJar) return [3, 8];
                    (0, core_1.debug)("Jar found in cache!");
                    return [4, fs_1.promises.copyFile(cachedJar + "/ew-cli.jar", "".concat(process_1.env.HOME, "/.cache/emulator-wtf/ew-cli-").concat(version, ".jar"))];
                case 7:
                    _a.sent();
                    _a.label = 8;
                case 8: return [4, (0, exec_1.exec)('ew-cli --version')];
                case 9:
                    _a.sent();
                    if (!cachedJar) {
                        (0, core_1.debug)("Caching jar...");
                        (0, tool_cache_1.cacheFile)("".concat(process_1.env.HOME, "/.cache/emulator-wtf/ew-cli-").concat(version, ".jar"), 'ew-cli.jar', 'emulatorwtf-jar', version);
                    }
                    return [3, 11];
                case 10:
                    e_1 = _a.sent();
                    (0, core_1.warning)("ew-cli installation failed: ".concat(e_1));
                    (0, core_1.setFailed)(e_1);
                    return [3, 11];
                case 11: return [2];
            }
        });
    });
}
setup();
//# sourceMappingURL=index.js.map