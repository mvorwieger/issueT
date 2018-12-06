#!/usr/bin/env node
const fs = require("fs");
const { promisify } = require("util");
const readFile = promisify(fs.readFile)
const { postIssue, getIssues } = require('./github')
const getCliData = require('./cli')
const todoRegExp = () => new RegExp(/^(.*)TODO: (.*)$/gm);
const gitHubUrlRegExp = () => new RegExp(/^(.*)url = (.*)$/gm);
const githubApi = 'api.github.com';
const program = require('commander')
const { username, password, path } = require("./cli")

/**
 * Gives you the todo comments from the given file 
 * @param {string} pathToFile 
 */
const getTodoCommentFromFile = async (pathToFile) => {
    const data = await readFile(pathToFile);
    const fileContent = (data.toString());
    const allTodoComments = fileContent.match(todoRegExp());
    if (allTodoComments) {
        const regexGroups = allTodoComments.map(comment => todoRegExp().exec(comment));
        return (regexGroups.map((regexobj) => getStuffOutOfRegExObj(regexobj)))
    } else {
        throw new Error("no Todo Comments Found")
    }
};

/**
 * A helper function to parse out the comments from the RegEx Arrays 
 * @param {Array<any>} regexthingy 
 */
const getStuffOutOfRegExObj = regexthingy => {
    const [fullComment, _, comment, ...rest] = regexthingy;

    return { fullComment, comment };
};

/**
 * Gives the current origin url from .git/config 
 * this might be a problem later on because it only works 
 * in the root path of the project (the location where .git/config is located)
 * @param {string} path 
 */
const getGithubUrlInPath = async (path) => {
    const fileBuffer = await readFile(path + '/.git/config')
    const result = gitHubUrlRegExp().exec(fileBuffer.toString());
    if (result != null) {
        resolve(result[2])
    } else {
        throw new Error("Please check your current path, there was no .git/config found in your current path")
    }
};

(async () => {
    try {
        //TODO: Look if there is some cleaner way to get arguments
        //TODO: Look for a way to cache username and password (Config files ?)
        const comments = await getTodoCommentFromFile(path);
        const gitHubUrl = await getGithubUrlInPath('./');
        // 1 = everything after github.com | 0 = everything before .git
        const repoPath = gitHubUrl.split('github.com')[1].split(".git")[0];
        // TODO: Add some option to add body to a github issue instead of it just being the same as the body

        const response = await getIssues(username, password, githubApi, repoPath)
        const postedGithubIssues = response.data.map(a => a.body)
        const newComments = comments.filter(comment => !postedGithubIssues.includes(comment.comment))

        newComments.forEach(async (comment, _, arr) => {
            const posted = await postIssue(username, password, githubApi, repoPath, comment.comment, comment.comment)
        })
        console.log(`${newComments.length} issues created`);

    } catch (e) {
        console.log(e)
        console.log("Upps... something went wrong :(")
    }
})();
