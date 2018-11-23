// TODO: get filepath from command line args
import axios from "axios"
import fs from "fs"

const filePath = './examples/index.js';
const todoRegExp = () => new RegExp(/^(.*)TODO: (.*)$/gm);
const gitHubUrlRegExp = () => new RegExp(/^(.*)url = (.*)$/gm);
const githubApi = 'api.github.com';

const getTodoCommentFromFile =
    (pathToFile: string): Promise<RegExpExecArray[]> => {
      return new Promise((res: Function, rej: Function) => {
        fs.readFile(pathToFile, (err: Error, data: Buffer) => {
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

const getStuffOutOfRegExObj = (regexthingy: RegExpExecArray) => {
  const [fullComment, _, comment, ...rest] = regexthingy;

  return {fullComment, comment};
};

const getGithubUrlInPath = (path: string): Promise<string> => {
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

const getIssues =
    (username: string, password: string, githubApi: string, repoPath: string):
        void => {
          axios
              .get(`https://${username}:${password}@${githubApi}/repos/${
                  repoPath}/issues`)
              .then(res => {console.log(res)})
              .catch(e => { console.log(e); });
        }

const postIssue = (username: string, password: string, githubApi: string,
                   repoPath: string, title: string, body: string):
    Promise<any> => {
      const issueDetails = {
        title,
        body,
      }

      const url =
          `https://${username}:${password}@${githubApi}/repos${repoPath}/issues`

      return axios.post(url, (issueDetails))
    }

(async () => {
  const [nodeLocation, currentPath, username, password] = process.argv;
  const regExObjects = await getTodoCommentFromFile(filePath);
  const comments =
      regExObjects.map((regexobj) => getStuffOutOfRegExObj(regexobj));
  const gitHubUrl = await getGithubUrlInPath('./');
  const repoPath = gitHubUrl.split('github.com')[1];
  const splitAwayDotGit = repoPath.split(".git")[0]

  // TODO: Add some option to add body to a github issue instead of it just
  // being the same as the body

  comments.forEach(async (comment) => {
    try {
      const posted =
          await postIssue(username, password, githubApi, splitAwayDotGit,
                          comment.comment, comment.comment)
      console.log(posted)
    } catch (e) {
      console.log(e)
    }
  })
})();
