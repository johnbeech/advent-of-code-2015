var read = require('../lib/read');

read(__dirname + '/input.txt', 'utf8')
    .then(split)
    .then(parse)
    .then(solve)
    .then(report)
    .catch(error);

function split(input) {
    var lines = input.replace(/\r/g, '').split('\n');
    return Promise.accept(lines);
}

function parse(lines) {
    var matcher = /([A-z]+): (.*)/;
    return lines.map(function(line) {
        var matches = line.match(matcher);
        var ingredient = {
            name: matches[1],
        };
        var properties = matches[2].split(', ');
        properties.forEach(function(property) {
            console.log(ingredient.name, property);
            var s = property.split(' ');
            var key = s[0];
            var value = parseInt(s[1]);
            ingredient[key] = value;
        });
        return ingredient;
    });
}

function solve(index) {
    return index;
}

function report(summary) {
    console.log('Summary:', JSON.stringify(summary, null, '  '));
}

function error(ex) {
    console.log('Error:', ex);
    !ex.stack || console.log(ex.stack);
}