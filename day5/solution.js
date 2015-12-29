var read = require('../lib/read');

var threeVowelsRegex = /([aeiou].*[aeiou].*[aeiou])/;
var doubleLettersRegex = /([a-z])\1/;
var illegalStringsRegex = /ab|cd|pq|xy/;

console.log('Day 2');
if (niceTest('ugknbfddgicrmopn') && niceTest('aaa') && !niceTest('jchzalrnumimnmhp') && !niceTest('haegwjzuvuyypxyu') && !niceTest('dvszwmarrgswjxmb')) {
    read(__dirname + '/input.txt', 'utf8')
        .then(solve)
        .catch(error);
} else {
    console.log('Failed start-up tests');
}

function solve(input) {
    return split(input)
        .then(naughtyOrNice)
        .then(report);
}

function split(input) {
    var lines = input.replace(/\r/g, '').split('\n');
    return Promise.accept(lines);
}

function naughtyOrNice(lines) {
    console.log('Provided', lines.length, 'strings to check');
    var niceLines = lines.filter(function(line) {
        return niceTest(line);
    });
    return {
        'Number of nice strings': niceLines.length,
        'Number of nasty strings': lines.length - niceLines.length
    };
}

function niceTest(line) {
    return threeVowelsRegex.test(line) && doubleLettersRegex.test(line) && !illegalStringsRegex.test(line);
}

function report(summary) {
    console.log('Report', JSON.stringify(summary, null, '  '));
}

function error(ex) {
    console.log('Error', ex);
}