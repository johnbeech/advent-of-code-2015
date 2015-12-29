var read = require('../lib/read');
var md5 = require('md5');

console.log('Day 4');

if (test('abcdef', 609043, generatePattern(5, '0')) && test('pqrstuv', 1048970, generatePattern(5, '0'))) {
    read(__dirname + '/input.txt', 'utf8')
        .then(solveFor(5))
        .then(report)
        .catch(error);

    read(__dirname + '/input.txt', 'utf8')
        .then(solveFor(6))
        .then(report)
        .catch(error);
} else {
    console.log('Start-up tests failed');
}

function solveFor(length) {
    return function(secret) {
        var pattern = generatePattern(length, '0');
        return solve(secret, pattern);
    };
}

function generatePattern(length, char) {
    var pattern = '';
    while (length > 0) {
        pattern += char;
        length--;
    }
    return pattern;
}

function solve(input, pattern) {
    var secret = input;
    var number = 0;
    while (test(secret, number, pattern) == false) {
        number++;
        if (number % 10000 === 0) {
            console.log('Tested', number, 'entries');
        }
    };

    return {
        'Secret': secret,
        'Pattern': pattern,
        'Solved number': number
    };
}

function test(secret, number, pattern) {
    var hash = md5(secret + number);
    return (hash.indexOf(pattern) === 0);
}

function report(summary) {
    console.log('Report', summary);
}

function error(ex) {
    console.log('Error', ex);
}