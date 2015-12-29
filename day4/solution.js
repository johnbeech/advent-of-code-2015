var read = require('../lib/read');
var md5 = require('md5');

console.log('Day 4');

if (test('abcdef', 609043) && test('pqrstuv', 1048970)) {
    read(__dirname + '/input.txt', 'utf8')
        .then(solve)
        .then(report)
        .catch(error);
}

function solve(input) {
    var secret = input;
    var number = 0;
    while (test(secret, number) == false) {
        number++;
        if (number % 1000 === 0) {
            console.log('Tested', number, 'entries');
        }
    };

    return {
        'Solved number': number
    };
}

function test(secret, number) {
    var hash = md5(secret + number);
    return (hash.indexOf('00000') === 0);
}

function report(summary) {
    console.log('Report', summary);
}

function error(ex) {
    console.log('Error', ex);
}