#!/usr/bin/env node
const axios = require("axios");
const fs = require("fs");

const todoRegExp = () => new RegExp(/^(.*)TODO: (.*)$/gm);
const gitHubUrlRegExp = () => new RegExp(/^(.*)url = (.*)$/gm);
const githubApi = 'api.github.com';

const getTodoCommentFromFile = pathToFile => {
  return new Promise((res, rej) => {
    fs.readFile(pathToFile, (err, data) => {
      if (err) {
        rej(err);
      }

      const fileContent = (data.toString());
      const allTodoComments = fileContent.match(todoRegExp());
      if (allTodoComments) {
        const regexGroups = allTodoComments.map(
          comment => { return todoRegExp().exec(comment); });
        res(regexGroups);
      } else {
        rej("no Todo Comments Found")
      }
    });
  });
};

const getStuffOutOfRegExObj = regexthingy => {
  const [fullComment, _, comment, ...rest] = regexthingy;

  return { fullComment, comment };
};

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

const getIssues = (username, password, githubApi, repoPath) => {
  return axios
    .get(`https://${username}:${password}@${githubApi}/repos/${
      repoPath}/issues`)
}

const postIssue = (username, password, githubApi,
  repoPath, title, body) => {
  const issueDetails = {
    title,
    body,
  }

  const url =
    `https://${username}:${password}@${githubApi}/repos${repoPath}/issues`

  return axios.post(url, (issueDetails))
}

(async () => {
  const [nodeLocation, currentPath, filePath, username, password] = process.argv;
  console.log(filePath, username, password);
  const regExObjects = await getTodoCommentFromFile(filePath);
  const comments =
    regExObjects.map((regexobj) => getStuffOutOfRegExObj(regexobj));
  const gitHubUrl = await getGithubUrlInPath('./');
  const repoPath = gitHubUrl.split('github.com')[1];
  const splitAwayDotGit = repoPath.split(".git")[0]

  // TODO: Add some option to add body to a github issue instead of it just being the same as the body

  comments.forEach(async (comment, _, arr) => {
    try {
      const posted = await postIssue(username, password, githubApi, splitAwayDotGit, comment.comment, comment.comment)
    } catch (e) {
      console.log(e)
    }

  })

  console.log(`${comments.length} issues created`);
})();
