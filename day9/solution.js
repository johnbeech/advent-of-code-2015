var read = require('../lib/read');

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
    locations[start] = locations[start] || {
        map: {}
    };
    locations[start].map[end] = {
        distance: distance
    };
}

function solve(locations) {
    var createMap = function() {
        return createMapFromLocations(locations);
    };
    return locations;
}

function report(summary) {
    console.log('Summary:', JSON.stringify(summary, null, '  '));
}

function error(ex) {
    console.log('Error:', ex);
    console.log(ex.stack);
}