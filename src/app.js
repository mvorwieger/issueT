// TODO: get filepath from command line args
const fs = require('fs');
const axios = require('axios');
const filePath = './examples/index.js';
const username = 'mvorwieger';
const password = 'Grundig1999';
const repoLink = 'mvorwieger/testRepo';
const todoRegExp = () => new RegExp(/^(.*)TODO: (.*)$/gm);
const gitHubUrlRegExp = () => new RegExp(/^(.*)url = (.*)$/gm);
const githubApi = 'api.github.com';

const getTodoCommentFromFile = async (pathToFile) => {
    return new Promise((res, rej) => {
        fs.readFile(pathToFile, (err, data) => {
            if (err) {
                rej(err);
            }

            const fileContent = (data.toString());
            const allTodoComments = fileContent.match(todoRegExp());
            const regexGroups = allTodoComments.map(
                comment => {
                    return todoRegExp().exec(comment);
                });

            res(regexGroups);
        });
    });
};

const getStuffOutOfRegExObj = (regexthingy) => {
    const [fullComment, _, comment, ...rest] = regexthingy;

    return {fullComment, comment};
};

const postIssueOnGithub = async (username, password, githubrepo) => {
    // TODO: Connect to Github
    // https://developer.github.com/v3/issues/#create-an-issue
    return true;
};

const getGithubUrlInPath = async (path) => {
    return new Promise(((resolve, reject) => {
        fs.readFile(path + '/.git/config', (err, fileBuffer) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(gitHubUrlRegExp().exec(fileBuffer.toString())[2])
        });
    }));
};

(async () => {
    const regExObjects = await getTodoCommentFromFile(filePath);
    const comments = regExObjects.map((regexobj) => getStuffOutOfRegExObj(regexobj));
    const gitHubUrl = await getGithubUrlInPath('./');
    gitHubUrl.split("github.com");
    axios.get(`https://${username}:${password}@${githubApi}`)
        .then(res => {
            //console.log(res)
        })
        .catch(e => {
            console.log(e);
        });
})();
