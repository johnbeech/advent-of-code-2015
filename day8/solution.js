var read = require('../lib/read');

console.log('Day 8');
read(__dirname + '/input.txt', 'utf8')
    .then(split)
    .then(solve)
    .then(report)
    .catch(error);

function split(input) {
    var lines = input.replace(/\r/g, '').split('\n');
    return Promise.accept(lines);
}

function solve(lines) {
    var inputCount = 0;
    var memoryCount = 0;
    var parsed = lines.map(function(line) {
        inputCount = inputCount + line.length;
        try {
            var parsedLine = line;
            parsedLine = parsedLine.slice(1, -1);
            parsedLine = parsedLine.replace(/\\\\/g, '~');
            parsedLine = parsedLine.replace(/\\\"/g, '-');
            parsedLine = parsedLine.replace(/\\x[A-Fa-f0-9]{2}/g, '#');
            memoryCount = memoryCount + parsedLine.length;
            console.log([line.length, line].join(' '));
            console.log([parsedLine.length, '', parsedLine].join(' '));
            return parsedLine;
        } catch (ex) {
            console.log('Unable to parse', line, ex);
            return line;
        }
    });
    return {
        'String length from input': inputCount,
        'String length in memory': memoryCount,
        'Difference': inputCount - memoryCount
    }
}

function report(summary) {
    console.log('Summary:', summary);
}

function error(ex) {
    console.log('Error:', ex);
    console.log(ex.stack);
}