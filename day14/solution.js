var read = require('../lib/read');

var raceLength = 2503;

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
                speed: parseInt(matches[2]),
                time: parseInt(matches[3])
            },
            rest: parseInt(matches[4])
        };
    });
}

function index(instructions) {
    var index = {};
    instructions.forEach(function(instruction) {
        index[instruction.reindeer] = {
            name: instruction.reindeer,
            fly: instruction.fly,
            rest: instruction.rest
        };
    });

    return index;
}

function solve(index) {
    var names = Object.keys(index);
    var results = names.map(function(name) {
        var reindeer = index[name];
        var racer = race(reindeer, 2503);
        return racer;
    });

    results.sort(function(a, b) {
        return b.distance - a.distance;
    });

    return {
        index,
        results,
        winner: results[0]
    };
}

function race(reindeer, time) {
    var racer = {
        reindeer,
        resting: 0,
            flying: reindeer.fly.time,
            distance: 0,
            graph: ''
    };

    while (time > 0) {
        if (racer.flying > 0) {
            racer.distance = racer.distance + reindeer.fly.speed;
            racer.graph += '^';
        } else {
            racer.graph += '-';
        }

        if (racer.resting > 0) {
            racer.resting--;
            if (racer.resting === 0) {
                racer.flying = reindeer.fly.time;
            }
        } else {
            if (racer.flying > 0) {
                racer.flying--;
            } else {
                racer.resting = reindeer.rest - 1;
            }
        }
        time--;
    }

    console.log(reindeer.name, racer.distance, racer.graph);
    console.log();

    racer.time = racer.graph.length;
    delete racer.graph;

    return racer;
}

function report(summary) {
    console.log('Summary:', JSON.stringify(summary, null, '  '));
}

function error(ex) {
    console.log('Error:', ex);
    !ex.stack || console.log(ex.stack);
}