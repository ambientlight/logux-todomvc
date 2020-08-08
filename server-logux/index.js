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
exports.__esModule = true;
var server_1 = require("@logux/server");
var path = require("path");
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
var AWS = require("aws-sdk");
var cognito = new AWS.CognitoIdentityServiceProvider();
var server = new server_1.Server(server_1.Server.loadOptions(process, {
    subprotocol: '1.0.0',
    supports: '1.x',
    root: __dirname
}));
server.auth(function (auth) {
    // Allow only local users until we will have a proper authentication
    return process.env.NODE_ENV === 'development';
});
server.type(/^\w*TODO|SET_VISIBILITY_FILTER$/, {
    access: function (ctx, action, meta) {
        return true;
    },
    /*
    resend (ctx, action, meta) {
      // Resend this action to everyone who subscribed to this user
      return { channel: `TEST` }
    },
    */
    process: function (ctx, action, meta) {
    },
    "finally": function (ctx, action, meta) {
    }
});
server.type('SIGN_UP', {
    access: function (ctx, action, meta) { return true; },
    process: function (ctx, action, meta) {
        return __awaiter(this, void 0, void 0, function () {
            var signUpResult, error_1, confirmResult, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, cognito.signUp({
                                ClientId: process.env.USERPOOL_CLIENT_ID,
                                Password: action.password,
                                Username: action.username
                            }).promise()];
                    case 1:
                        signUpResult = _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.error(error_1);
                        ctx.sendBack({
                            type: "SIGN_UP_ERROR",
                            username: action.username,
                            error: error_1
                        });
                        return [2 /*return*/];
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, cognito.adminConfirmSignUp({
                                UserPoolId: process.env.USERPOOL_ID,
                                Username: action.username
                            }).promise()
                            // user confirmed
                        ];
                    case 4:
                        confirmResult = _a.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        error_2 = _a.sent();
                        console.error(error_2);
                        return [3 /*break*/, 6];
                    case 6:
                        // pass back credentials to the client
                        ctx.sendBack({
                            type: "SIGN_UP_SUCCESS",
                            username: action.username,
                            token: signUpResult.$response.data.UserSub
                        });
                        return [2 /*return*/];
                }
            });
        });
    }
});
server.channel('TEST', {
    access: function (ctx, action, meta) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, true];
            });
        });
    },
    load: function (ctx, action, meta) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, { type: 'ADD_TODO', text: 'Hello from Logux' }];
            });
        });
    }
});
server.otherType({
    access: function (ctx, action, meta) { return true; },
    process: function (ctx, action, meta) {
        // do some processing for all expicitly unhandled action
        console.error("Unhandle actions");
        console.error(action);
    },
    "finally": function (ctx, action, meta) {
        // finalization logic for all explictly unhandled actions
    }
});
server.listen();
