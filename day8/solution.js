var read = require('../lib/read');

console.log('Day 8');
part1()
    .then(part2)
    .catch(error);

function part1() {
    console.log('Part 1');
    return read(__dirname + '/input.txt', 'utf8')
        .then(split)
        .then(solve)
        .then(report);
}

function part2() {
    console.log('Part 2');
    return read(__dirname + '/input.txt', 'utf8')
        .then(split)
        .then(encode)
        .then(report);
}

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
            //console.log([line.length, line].join(' '));
            //console.log([parsedLine.length, '', parsedLine].join(' '));
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

function encode(lines) {
    var inputCount = 0;
    var encodedCount = 0;
    var parsed = lines.map(function(line) {
        inputCount = inputCount + line.length;
        try {
            var encodedLine = line;
            encodedLine = encodedLine.replace(/\"/g, '--');
            encodedLine = encodedLine.replace(/\\/g, '~~');
            encodedLine = '"' + encodedLine + "'";
            encodedCount = encodedCount + encodedLine.length;
            console.log([line.length, line].join(' '));
            console.log([encodedLine.length, '', encodedLine].join(' '));
            return encodedLine;
        } catch (ex) {
            console.log('Unable to encode', line, ex);
            return line;
        }
    });
    return {
        'String length from input': inputCount,
        'String length when encoded': encodedCount,
        'Difference': encodedCount - inputCount
    }
}

function report(summary) {
    console.log('Summary:', summary);
}

function error(ex) {
    console.log('Error:', ex);
    console.log(ex.stack);
}