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
        var start = Date.now();
        action(state.lights, instruction);
        console.log('Processed instruction', instruction, ((Date.now() - start) / 1000).toFixed(3) + 's');
    });

    var summary = summariseLightState(state.lights);
    summary['Number of instructions'] = instructions.length;
    return summary;
}

function initialState() {
    return {
        lights: {}
    };
}

function toggleLights(lights, range) {
    changeLights(lights, range, (light) => (light || 0) + 2);
}

function turnOnLights(lights, range) {
    changeLights(lights, range, (light) => (light || 0) + 1);
}

function turnOffLights(lights, range) {
    changeLights(lights, range, (light) => Math.max(0, (light || 0) - 1));
}

function changeLights(lights, range, fn) {
    for (var j = range.bottom; j <= range.top; j++) {
        for (var i = range.left; i <= range.right; i++) {
            var key = i + ':' + j;
            lights[key] = fn(lights[key]);
        }
    }
}

function summariseLightState(lights) {
    var count = 0;
    var brightness = 0;
    Object.keys(lights).forEach(function(key) {
        if (lights[key]) {
            count++;
        };
        brightness += lights[key];
    });
    return {
        'Number of lights on': count,
        'Total Brightness': brightness
    };
}

function report(summary) {
    console.log('Report', JSON.stringify(summary, null, '  '));
}

function error(ex) {
    console.log('Error', ex, ex.stack);
}