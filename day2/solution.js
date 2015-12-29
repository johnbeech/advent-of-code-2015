var read = require('../lib/read');

read(__dirname + '/input.txt', 'utf8')
    .then(solve)
    .catch(error);

function solve(input) {
    return split(input)
        .then(parse)
        .then(wrap)
        .then(reduce)
        .then(report);
}

function split(input) {
    var lines = input.replace(/\r/g, '').split('\n');
    return Promise.accept(lines);
}

function parse(lines) {
    console.log('Provided', lines.length, 'presents to wrap');
    return lines.map(function(line) {
        var size = line.split('x')
        return {
            w: size[0],
            h: size[1],
            d: size[2]
        };
    });
}

function wrap(boxes) {
    return boxes.map(function(box) {
        return surfaceArea(box.w, box.h, box.d) + smallestSide(box.w, box.h, box.d);
    });
}

function reduce(boxes) {
    var count = 0;
    boxes.forEach(function(box) {
        count = count + box;
    });
    return count;
}

function surfaceArea(w, h, d) {
    return (2 * w * h) + (2 * w * d) + (2 * h * d);
}

function smallestSide(w, h, d) {
    return Math.min(w * h, w * d, h * d);
}

function report(areaOfWrappingPaperRequired) {
    console.log('The elves need a total of', areaOfWrappingPaperRequired, 'square feet of wrapping paper.');
}

function error(ex) {
    console.log('Error', ex);
}