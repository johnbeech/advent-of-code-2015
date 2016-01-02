var read = require('../lib/read');

read(__dirname + '/input.txt', 'utf8')
    .then(split)
    .then(parse)
    .then(solve)
    .then(report)
    .catch(error);

function split(input) {
    var lines = input.replace(/\r/g, '').split('\n');
    return Promise.accept(lines);
}

function parse(lines) {
    var matcher = /([A-z]+): ([a-z]+) ([-\d]+), ([a-z]+) ([-\d]+), ([a-z]+) ([-\d]+), ([a-z]+) ([-\d]+), ([a-z]+) ([-\d]+)/;
    return lines.map(function(line) {
        var matches = line.match(matcher);
        var ingredient = {
            name: matches[1],
        };
        ingredient[matches[2]] = parseInt(matches[3]);
        ingredient[matches[4]] = parseInt(matches[5]);
        ingredient[matches[6]] = parseInt(matches[7]);
        ingredient[matches[8]] = parseInt(matches[9]);
        ingredient[matches[10]] = parseInt(matches[11]);
        return ingredient;
    });
}

function solve(index) {
    return index;
}

function report(summary) {
    console.log('Summary:', JSON.stringify(summary, null, '  '));
}

function error(ex) {
    console.log('Error:', ex);
    !ex.stack || console.log(ex.stack);
}