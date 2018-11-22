// TODO: get filepath from command line args
const fs = require("fs");
const filePath = "./examples/index.js";
const username = "mvorwieger";
const password = "Grundig1999";
const repoLink = "mvorwieger/testRepo";
const todoRegExp = () => new RegExp(/^(.*)TODO: (.*)$/gm)

const getTodoCommentFromFile = async (pathToFile) => {
  return new Promise((res, rej) => {fs.readFile(pathToFile, (err, data) => {
                       if (err) {
                         rej(err)
                       }

                       const fileContent = (data.toString())
                       const allTodoComments = fileContent.match(todoRegExp())
                       const regexGroups = allTodoComments.map(
                           comment => {return todoRegExp().exec(comment)})

                       res(regexGroups)
                     })})
}

const getStuffOutOfRegExObj = (regexthingy) => {
  const [fullcomment, _, comment, ...rest] = regexthingy

  return { fullcomment, comment }
}

const postIssueOnGithub = async (username, password, githubrepo) => {
  // TODO: Connect to Github
  // https://developer.github.com/v3/issues/#create-an-issue
  return true;
}

(async () => {
    const regExObjects = await getTodoCommentFromFile(filePath)
    const comments = regExObjects.map((regexobj) => getStuffOutOfRegExObj(regexobj))
    await postIssueOnGithub(username, password, repoLink)

})()
