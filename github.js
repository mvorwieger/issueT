const axios = require('axios');
/**
 * Gives you the current Open Issues for your origin 
 * @param {string} username 
 * @param {string} password 
 * @param {string} githubApi 
 * @param {string} repoPath 
 * @returns {Promise<string[]>}
 */
const getIssues = (username, password, githubApi, repoPath) => {
    return new Promise((res, rej) => {
        axios
            .get(`https://${username}:${password}@${githubApi}/repos${repoPath}/issues`)
            .then(res)
            .catch(e => {
                rej("Error while fetching your Issues, please check your credentials")
            })
    })
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

    return new Promise((res, rej) => {
        axios.post(url, issueDetails)
            .then(res)
            .catch(e => {
                rej("Error while posting your Issues")
            })
    })
}

module.exports = { getIssues, postIssue }
