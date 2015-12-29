var read = require('../lib/read');

console.log('Day 7');

read(__dirname + '/input.txt', 'utf8')
    .then(solve)
    .catch(error);

function solve(input, test) {
    return split(input)
        .then(parse)
        .then(processInstructions)
        .then(report);
}

function split(input) {
    var lines = input.replace(/\r/g, '').split('\n');
    return Promise.accept(lines);
}

function parse(lines) {
    var instructionMatcher = /(NOT)? ?([a-z\d]+) (AND|OR|RSHIFT|LSHIFT)? ?([a-z\d]+)? ?-> ([a-z]+)/;
    return lines.map(function(line) {
        var instruction = line.match(instructionMatcher);
        var negateInput = instruction[1] ? true : false;
        var input = instruction[2];
        var operation = (instruction[3]) ? {
            operator: instruction[3],
            value: instruction[4]
        } : false;

        var target = instruction[5];
        return {
            negateInput, input, operation, target
        };
    });
}

function processInstructions(instructions) {
    return {
        'Instructions': instructions
    };
}

function validateMatches(matches, line) {
    if (matches.length !== 6) {
        throw 'Syntax error, instruction line did not match: ' + matcher + ', ' + line;
    }
}

function report(summary) {
    console.log('Report', JSON.stringify(summary, null, '  '));
}

function error(ex) {
    console.log('Error', ex, ex.stack);
}