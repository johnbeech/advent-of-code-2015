var read = require('../lib/read');

console.log('Day 6');

const part1 = {
    'toggle': (lights, range) => {
        changeLights(lights, range, (light) => light + 2);
    },
    'turn on': (lights, range) => {
        changeLights(lights, range, (light) => light + 1);
    },
    'turn off': (lights, range) => {
        changeLights(lights, range, (light) => Math.max(0, light - 1));
    }
}

const part2 = {
  'toggle': (lights, range) => {
      changeLights(lights, range, (light) => Math.abs(light - 1));
  },
  'turn on': (lights, range) => {
      changeLights(lights, range, (light) => 1);
  },
  'turn off': (lights, range) => {
      changeLights(lights, range, (light) => 0);
  }
}

Promise.all([
  read(__dirname + '/input.txt', 'utf8').then(input => solve(input, part1)),
  read(__dirname + '/input.txt', 'utf8').then(input => solve(input, part2))
])
.then(results => results.map(report))
.catch(error);

function solve(input, actions) {
    return split(input.trim())
        .then(parse)
        .then(n => processInstructions(n, actions))
}

function split(input) {
    var lines = input.replace(/\r/g, '').split('\n');
    return Promise.resolve(lines);
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

function processInstructions(instructions, actions) {
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

function changeLights(lights, range, fn) {
    for (var j = range.bottom; j <= range.top; j++) {
        for (var i = range.left; i <= range.right; i++) {
            var key = i + ':' + j;
            lights[key] = fn(lights[key] || 0);
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
