#!/usr/bin/env node
const axios = require("axios");
const fs = require("fs");

const todoRegExp = () => new RegExp(/^(.*)TODO: (.*)$/gm);
const gitHubUrlRegExp = () => new RegExp(/^(.*)url = (.*)$/gm);
const githubApi = 'api.github.com';

/**
 * Gives you the todo comments from the given file 
 * @param {string} pathToFile 
 */
const getTodoCommentFromFile = pathToFile => {
    return new Promise((res, rej) => {
        fs.readFile(pathToFile, (err, data) => {
            if (err) {
                rej(err);
            }

            const fileContent = (data.toString());
            const allTodoComments = fileContent.match(todoRegExp());
            if (allTodoComments) {
                const regexGroups = allTodoComments.map(comment => todoRegExp().exec(comment));
                res(regexGroups.map((regexobj) => getStuffOutOfRegExObj(regexobj)))
            } else {
                rej("no Todo Comments Found")
            }
        });
    });
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
const getGithubUrlInPath = path => {
    return new Promise(((resolve, reject) => {
        fs.readFile(path + '/.git/config', (err, fileBuffer) => {
            if (err) {
                reject(err);
                return;
            }
            const result = gitHubUrlRegExp().exec(fileBuffer.toString());
            if (result != null) {
                resolve(result[2])
            } else {
                reject("no remote gihub repository inside .git/config")
            }
        });
    }));
};

/**
 * Gives you the current Open Issues for your origin 
 * @param {string} username 
 * @param {string} password 
 * @param {string} githubApi 
 * @param {string} repoPath 
 * @returns {Promise<string[]>}
 */
const getIssues = (username, password, githubApi, repoPath) => {
    return axios
        .get(`https://${username}:${password}@${githubApi}/repos${repoPath}/issues`)
}

/**
 * Posts a Issue to Github with the given title and body
 * @param {string} username 
 * @param {string} password 
 * @param {string} githubApi 
 * @param {string} repoPath 
 * @param {string} title 
 * @param {string} body 
 */
const postIssue = (username, password, githubApi, repoPath, title, body) => {
    const issueDetails = {
        title,
        body,
    }

    const url = `https://${username}:${password}@${githubApi}/repos${repoPath}/issues`

    return axios.post(url, issueDetails)
}

(async () => {
    //TODO: Look if there is some cleaner way to get arguments
    //TODO: Look for a way to cache username and password (Config files ?)
    const [nodeLocation, currentPath, filePath, username, password] = process.argv;
    const comments = await getTodoCommentFromFile(filePath);
    const gitHubUrl = await getGithubUrlInPath('./');
    // 1 = everything after github.com | 0 = everything before .git
    const repoPath = gitHubUrl.split('github.com')[1].split(".git")[0];

    // TODO: Add some option to add body to a github issue instead of it just being the same as the body

    try {
        const response = await getIssues(username, password, githubApi, repoPath)
        const postedGithubIssues = response.data.map(a => a.body)
        const newComments = comments.filter(comment => !postedGithubIssues.includes(comment.comment))

        newComments.forEach(async (comment, _, arr) => {
                const posted = await postIssue(username, password, githubApi, repoPath, comment.comment, comment.comment)
        })
        console.log(`${newComments.length} issues created`);
        
    } catch(e) {
        console.log("something went wrong, please check your username and or password")
    }
})();
