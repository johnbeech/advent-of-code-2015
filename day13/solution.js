var read = require('../lib/read');

read(__dirname + '/input.txt', 'utf8')
    .then(split)
    .then(parse)
    .then(index)
    .then(solve)
    .then(report)
    .catch(error);

function split(input) {
    var lines = input.replace(/\r/g, '').split('\n');
    return Promise.accept(lines);
}


function parse(lines) {
    var matcher = /([A-z]+) would (gain|lose) ([\d]+) happiness units by sitting next to ([A-z]+)./;
    return lines.map(function(line) {
        var matches = line.match(matcher);
        var multiplier = (matches[2] === 'gain') ? 1.0 : -1.0;
        return {
            actor: matches[1],
            happiness: multiplier * parseInt(matches[3]),
            neighbour: matches[4]
        };
    });
}

function index(instructions) {
    return instructions
}

function solve(index) {
    return index;
}

function report(summary) {
    console.log('Summary:', summary);
}

function error(ex) {
    console.log('Error:', ex);
    !ex.stack || console.log(ex.stack);
}