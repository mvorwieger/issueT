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
