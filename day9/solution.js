var read = require('../lib/read');
var write = require('../lib/write');

read(__dirname + '/input.txt', 'utf8')
    .then(split)
    .then(parse)
    .then(locate)
    .then(solve)
    .then(report)
    .catch(error);

function split(input) {
    var lines = input.replace(/\r/g, '').split('\n');
    return Promise.accept(lines);
}

function parse(lines) {
    var matcher = /([A-z]+) to ([A-z]+) = (\d+)/;
    return lines.map(function(line) {
        var matches = line.match(matcher);
        return {
            start: matches[1],
            end: matches[2],
            distance: parseInt(matches[3])
        };
    });
}

function locate(routes) {
    var locations = {};
    routes.forEach(function(route) {
        addRoute(locations, route.start, route.end, route.distance);
        addRoute(locations, route.end, route.start, route.distance);
    });
    return locations;
}

function addRoute(locations, start, end, distance) {
    locations[start] = locations[start] || {};
    locations[start][end] = {
        distance: distance,
        travelled: 0
    };
}

function solve(locations) {
    var list = Object.keys(locations);
    var reports = [];
    list.forEach(function(start) {
        var location = locations[start];
        var report = solveLocation(start, location, locations, list, [start], 0);
        reports = [].concat(reports, report);
    });

    reports.sort(function(a, b) {
        return b.travelled - a.travelled;
    });

    return reports;
}

function solveLocation(start, location, locations, list, route, travelled) {
    var reports = [];
    list.forEach(function(destination) {
        if (route.indexOf(destination) !== -1) {
            return;
        }

        var distance = locations[start][destination].distance;
        location[destination] = location[destination] || {};
        location[destination].travelled = travelled + distance;

        if (route.length + 1 === list.length) {
            var report = {
                route: [].concat(route, [destination]),
                travelled: location[destination].travelled
            };
            reports.push(report);
            console.log([report.route.join(' -> '), '=', location[destination].travelled].join(' '));
        }

        var newReports = solveLocation(destination, location[destination] || {}, locations, list, [].concat(route, [destination]), location[destination].travelled);
        reports = [].concat(reports, newReports);
    });
    return reports;
}

function report(summary) {
    var file = JSON.stringify(summary, null, '  ');
    console.log('Summary:', file);
    write('day9.json', file);
    return summary;
}

function error(ex) {
    console.log('Error:', ex);
    console.log(ex.stack);
}