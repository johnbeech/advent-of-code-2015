var read = require('../lib/read');

read(__dirname + '/input.json', 'utf8')
    .then(JSON.parse)
    .then(solve)
    .then(report)
    .catch(error);

function solve(input) {
    var total = sum(input);
    return {
        total
    };
}

function sum(object) {
    var total = 0;
    Object.keys(object).forEach(function(key) {
        var value = object[key];
        if (typeof value === 'object') {
            total = total + sum(value);
        }
        else if(!isNaN(value)) {
            total = total + parseInt(value);
        }
    });
    return total;
}

function report(summary) {
    console.log('Summary:', summary);
}

function error(ex) {
    console.log('Error:', ex);
    !ex.stack || console.log(ex.stack);
}