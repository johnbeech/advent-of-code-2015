var read = require('../lib/read');

// Nice and naughty tests
var threeVowelsRegex = /([aeiou].*[aeiou].*[aeiou])/;
var doubleLettersRegex = /([a-z])\1/;
var illegalStringsRegex = /ab|cd|pq|xy/;

// Nicer tests
var twoOfAPairRegex = /([a-z][a-z]).*(\1)/;
var xyxTestRegex = /([a-z])[a-z]\1/;

console.log('Day 5');
if (niceTest('ugknbfddgicrmopn') && niceTest('aaa') && !niceTest('jchzalrnumimnmhp') && !niceTest('haegwjzuvuyypxyu') && !niceTest('dvszwmarrgswjxmb') && nicerTest('qjhvhtzxzqqjkmpb') && nicerTest('xxyxx') && !nicerTest('uurcxstgmygtbstg') && !nicerTest('ieodomkazucvgmuy')) {
    console.log('Part 1');
    read(__dirname + '/input.txt', 'utf8')
        .then(solveWith(niceTest))
        .catch(error);

    console.log('Part 2');
    read(__dirname + '/input.txt', 'utf8')
        .then(solveWith(nicerTest))
        .catch(error);
} else {
    console.log('Failed start-up tests');
}

function solveWith(test) {
    return function(input) {
        solve(input, test);
    }
}

function solve(input, test) {
    return split(input)
        .then(naughtyOrNice(test))
        .then(report);
}

function split(input) {
    var lines = input.replace(/\r/g, '').split('\n');
    return Promise.accept(lines);
}

function naughtyOrNice(test) {
    return function(lines) {
        console.log('Provided', lines.length, 'strings to check');
        var niceLines = lines.filter(test);
        return {
            'Number of nice strings': niceLines.length,
            'Number of nasty strings': lines.length - niceLines.length
        };
    };
}

function niceTest(line) {
    return threeVowelsRegex.test(line) && doubleLettersRegex.test(line) && !illegalStringsRegex.test(line);
}

function nicerTest(line) {
    return twoOfAPairRegex.test(line) && xyxTestRegex.test(line);
}

function report(summary) {
    console.log('Report', JSON.stringify(summary, null, '  '));
}

function error(ex) {
    console.log('Error', ex);
}