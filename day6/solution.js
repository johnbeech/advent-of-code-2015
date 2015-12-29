var read = require('../lib/read');

var actions = {
    'toggle': toggleLights,
    'turn on': turnOnLights,
    'turn off': turnOffLights
};

console.log('Day 6');

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
    var matcher = /(toggle|turn on|turn off) (\d+),(\d+) through (\d+),(\d+)/;
    return lines.map(function(line) {
        var matches = line.match(matcher);
        validateMatches(matches, line);
        return mapInstruction(matches);
    });
}

function validateMatches(matches, line) {
    if (matches.length !== 6) {
        throw 'Syntax error, instruction line did not match: ' + matcher + ', ' + line;
    }
}

function mapInstruction(matches) {
    return {
        action: matches[1],
        bottom: Math.min(matches[5], matches[3]),
        left: Math.min(matches[2], matches[4]),
        top: Math.max(matches[3], matches[5]),
        right: Math.max(matches[4], matches[2])
    };
}

function processInstructions(instructions) {
    var state = initialState();
    instructions.forEach(function(instruction) {
        var action = actions[instruction.action];
        action(state.lights, instruction);
    });

    return {
        'Number of instructions': instructions.length,
        'Lights turned on': countLightsTurnedOn(state.lights)
    };
}

function initialState() {
    return {
        lights: {}
    };
}

function toggleLights(lights, range) {
    changeLights(lights, range, (light) => !light);
}

function turnOnLights(lights, range) {
    changeLights(lights, range, (light) => true);
}

function turnOffLights(lights, range) {
    changeLights(lights, range, (light) => false);
}

function changeLights(lights, range, fn) {
    for (var j = range.bottom; j <= range.top; j++) {
        for (var i = range.left; i <= range.right; i++) {
            var key = i + ':' + j;
            lights[key] = fn(lights[key]);
        }
    }
}

function countLightsTurnedOn(lights) {
    var count = 0;
    Object.keys(lights).forEach(function(key) {
        if (lights[key]) {
            count++;
        };
    });
    return count;
}

function report(summary) {
    console.log('Report', JSON.stringify(summary, null, '  '));
}

function error(ex) {
    console.log('Error', ex, ex.stack);
}