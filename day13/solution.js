var read = require('../lib/read');

var happiest = {
    total: 0
};

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
    var matcher = /([A-z]+) would (gain|lose) ([\d]+) happiness units by sitting next to ([A-z]+)./;
    return lines.map(function(line) {
        var matches = line.match(matcher);
        var multiplier = (matches[2] === 'gain') ? 1.0 : -1.0;
        return {
            actor: matches[1],
            happiness: multiplier * parseInt(matches[3]),
            neighbour: matches[4]
        };
    });
}

function index(instructions) {
    var index = {};

    instructions.forEach(function(instruction) {
        index[instruction.actor] = index[instruction.actor] || {
            happiness: 0,
            desired: {},
            undesired: {},
            names: {}
        };

        if (instruction.happiness > 0) {
            index[instruction.actor].desired[instruction.neighbour] = instruction.happiness;
        } else {
            index[instruction.actor].undesired[instruction.neighbour] = instruction.happiness;
        }
        index[instruction.actor].names[instruction.neighbour] = instruction.happiness;
    });

    return index;
}

function solve(index) {
    var reports = [];
    var names = Object.keys(index);

    names.forEach(function(name) {
        var actor = index[name];
        var report = solveFor(name, index, names, [name]);
        reports = reports.concat(report);
    });

    reports.sort(function(a, b) {
        return a.total - b.total;
    });

    return {
        index,
        reports
    };
}

function solveFor(name, index, names, seatingPlan) {
    var reports = [];
    names.forEach(function(neighbour) {
        if (seatingPlan.indexOf(neighbour) !== -1) {
            return;
        }

        var newReports = solveFor(neighbour, index, names, [].concat(seatingPlan, neighbour));
        reports = [].concat(reports, newReports);
    });

    if (Object.keys(seatingPlan).length === names.length) {
        var report = calculateHappiness(seatingPlan, index);
        if (report.total > happiest.total) {
            happiest = report;
            console.log('Happiest ->', seatingPlan.join(' <-> '), '<-', happiest.total);
            reports.push(report);
        }
    }

    return reports;
}

function calculateHappiness(seatingPlan, index) {
    var total = 0;
    var report = {};
    var current, previous, next;
    for (var i = 0; i < seatingPlan.length; i++) {
        current = seatingPlan[i];
        previous = seatingPlan[(i - 1 + seatingPlan.length) % seatingPlan.length];
        next = seatingPlan[(i + 1) % seatingPlan.length];
        report[current] = index[current].names[previous] + index[current].names[next];
        total = total + report[current];
    }

    return {
        report,
        total
    };
}

function report(summary) {
    console.log('Summary:', JSON.stringify(summary, null, '  '));
}

function error(ex) {
    console.log('Error:', ex);
    !ex.stack || console.log(ex.stack);
}