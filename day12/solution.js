var read = require('../lib/read');

read(__dirname + '/input.json', 'utf8')
    .then(JSON.parse)
    .then(solve)
    .then(report)
    .catch(error);

function solve(lines) {
    throw 'Not implemented';
}

function report(summary) {
    console.log('Summary:', summary);
}

function error(ex) {
    console.log('Error:', ex);
    !ex.stack || console.log(ex.stack);
}