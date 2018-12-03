const program = require('commander')

module.exports = () => {
    program
        .version('0.1.0')
        .usage('[options] <file ...>')
        .option('-p, --password <n>', 'Github password')
        .option('-u, --username <n>', 'Github username')
        .parse(process.argv);

    return {
        filePath: program.file,
        password: program.password,
        username: program.username
    }
}
