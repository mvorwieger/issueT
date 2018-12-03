const program = require('commander')
function range(val) {
    return val.split('..').map(Number);
}

function list(val) {
    return val.split(',');
}

function collect(val, memo) {
    memo.push(val);
    return memo;
}

function increaseVerbosity(v, total) {
    return total + 1;
}

program
    .version('0.1.0')
    .usage('[options] <file ...>')
    .option('-p, --password <n>', 'Github password')
    .option('-u, --username <n>', 'Github username')
    .parse(process.argv);

console.log(' int: %j', program.password);
console.log(program.username)
console.log(' args: %j', program.args);
