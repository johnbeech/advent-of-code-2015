var read = require('../lib/read');

var locations = {};

read(__dirname + '/input.txt', 'utf8')
    .then(split)
    .then(solve)
    .then(report)
    .catch(error);

function split(input) {
    var lines = input.replace(/\r/g, '').split('\n');
    return Promise.accept(lines);
}

function parse(lines) {
    var matcher = /([A-z]+) to ([A-z]+) = (\d+)/;
    return lines.map(function(line) {
        var matches = line.match(matcher);
        return {
            start: matches[1],
            end: matches[2],
            distance: matches[3]
        };
    });
}

function solve(lines) {
    return lines;
}

function report(summary) {
    console.log('Summary:', summary);
}

function error(ex) {
    console.log('Error:', ex);
    console.log(ex.stack);
}