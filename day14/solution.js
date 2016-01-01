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
    var matcher = /([A-z]+) can fly ([\d]+) km\/s for ([\d]+) seconds, but then must rest for ([\d]+) seconds./;
    return lines.map(function(line) {
        var matches = line.match(matcher);
        return {
            reindeer: matches[1],
            fly: {
                speed: matches[2],
                time: matches[3]
            },
            rest: matches[4]
        };
    });
}

function index(instructions) {
    var index = {};
    instructions.forEach(function(instruction) {
        index[instruction.reindeer] = {
            fly: instruction.fly,
            rest: instruction.rest
        };
    });

    return index;
}

function solve(index) {
    var report = {
        index
    };
    return report;
}

function report(summary) {
    console.log('Summary:', JSON.stringify(summary, null, '  '));
}

function error(ex) {
    console.log('Error:', ex);
    !ex.stack || console.log(ex.stack);
}