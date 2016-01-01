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
    var racers = names.map(function(name) {
        var reindeer = index[name];
        var racer = {
            reindeer: reindeer,
            resting: 0,
            flying: reindeer.fly.time,
            distance: 0,
            graph: '',
            score: 0
        };

        return racer;
    });

    var time = 2503;
    while (time > 0) {
        race(racers);
        time--;
    }

    var furthestTravelled = racers.sort(function(a, b) {
        return b.distance - a.distance;
    })[0];

    var highestScorer = racers.sort(function(a, b) {
        return b.score - a.score;
    })[0];

    racer = racers.map(function(racer) {
        racer.time = racer.graph.length;
        delete racer.graph;
        return racer;
    });

    return {
        index,
        racers,
        highestScorer,
        furthestTravelled
    };
}

function race(racers) {
    var furthestTravelled = 0;
    racers.forEach(function(racer) {
        if (racer.flying > 0) {
            racer.distance = racer.distance + racer.reindeer.fly.speed;
            racer.graph += '^';
        } else {
            racer.graph += '-';
        }

        if (racer.resting > 0) {
            racer.resting--;
            if (racer.resting === 0) {
                racer.flying = racer.reindeer.fly.time;
            }
        } else {
            if (racer.flying > 0) {
                racer.flying--;
            } else {
                racer.resting = racer.reindeer.rest - 1;
            }
        }

        furthestTravelled = Math.max(furthestTravelled, racer.distance);
    });

    racers.forEach(function(racer) {
        if (racer.distance === furthestTravelled) {
            racer.score++;
        }
    });
}

function report(summary) {
    console.log('Summary:', JSON.stringify(summary, null, '  '));
}

function error(ex) {
    console.log('Error:', ex);
    !ex.stack || console.log(ex.stack);
}