"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
var _this = this;
// TODO: get filepath from command line args
var fs = require('fs');
var axios = require('axios');
var filePath = './examples/index.js';
var todoRegExp = function () { return new RegExp(/^(.*)TODO: (.*)$/gm); };
var gitHubUrlRegExp = function () { return new RegExp(/^(.*)url = (.*)$/gm); };
var githubApi = 'api.github.com';
var getTodoCommentFromFile = function (pathToFile) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (res, rej) {
                fs.readFile(pathToFile, function (err, data) {
                    if (err) {
                        rej(err);
                    }
                    var fileContent = (data.toString());
                    var allTodoComments = fileContent.match(todoRegExp());
                    var regexGroups = allTodoComments.map(function (comment) { return todoRegExp().exec(comment); });
                    res(regexGroups);
                });
            })];
    });
}); };
var getStuffOutOfRegExObj = function (regexthingy) {
    var fullComment = regexthingy[0], _ = regexthingy[1], comment = regexthingy[2], rest = regexthingy.slice(3);
    return { fullComment: fullComment, comment: comment };
};
var postIssueOnGithub = function (username, password, githubrepo) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        // TODO: Connect to Github
        // https://developer.github.com/v3/issues/#create-an-issue
        return [2 /*return*/, true];
    });
}); };
var getGithubUrlInPath = function (path) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise((function (resolve, reject) {
                fs.readFile(path + '/.git/config', function (err, fileBuffer) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(gitHubUrlRegExp().exec(fileBuffer.toString())[2]);
                });
            }))];
    });
}); };
var getIssues = function (username, password, githubApi, repoPath) {
    axios
        .get("https://" + username + ":" + password + "@" + githubApi + "/repos/" + repoPath + "/issues")
        .then(function (res) { console.log(res); })
        .catch(function (e) { console.log(e); });
};
var postIssue = function (username, password, githubApi, repoPath, title, body) {
    var issueDetails = {
        title: title,
        body: body,
    };
    var url = "https://" + username + ":" + password + "@" + githubApi + "/repos" + repoPath + "/issues";
    return axios.post(url, (issueDetails));
};
(function () { return __awaiter(_this, void 0, void 0, function () {
    var _a, nodeLocation, currentPath, username, password, regExObjects, comments, gitHubUrl, repoPath, splitAwayDotGit;
    var _this = this;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = process.argv, nodeLocation = _a[0], currentPath = _a[1], username = _a[2], password = _a[3];
                return [4 /*yield*/, getTodoCommentFromFile(filePath)];
            case 1:
                regExObjects = _b.sent();
                comments = regExObjects.map(function (regexobj) { return getStuffOutOfRegExObj(regexobj); });
                return [4 /*yield*/, getGithubUrlInPath('./')];
            case 2:
                gitHubUrl = _b.sent();
                repoPath = gitHubUrl.split('github.com')[1];
                splitAwayDotGit = repoPath.split(".git")[0];
                comments.forEach(function (comment) { return __awaiter(_this, void 0, void 0, function () {
                    var posted, e_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, postIssue(username, password, githubApi, splitAwayDotGit, comment.comment, comment.comment)];
                            case 1:
                                posted = _a.sent();
                                console.log(posted);
                                return [3 /*break*/, 3];
                            case 2:
                                e_1 = _a.sent();
                                console.log(e_1);
                                return [3 /*break*/, 3];
                            case 3: return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); })();
