const program = require('commander')
program
    .version('0.1.0')
    .usage('[options] <file ...>')
    .option('-p, --password <n>', 'Github password')
    .option('-u, --username <n>', 'Github username')
    .parse(process.argv);

module.exports = {
    username: program.username,
    password: program.password,
    path: program.args[0]
}
