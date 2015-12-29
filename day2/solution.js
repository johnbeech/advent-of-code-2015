var read = require('../lib/read');

console.log('Day 2');
read(__dirname + '/input.txt', 'utf8')
    .then(solve)
    .catch(error);

function solve(input) {
    return split(input)
        .then(parse)
        .then(wrap)
        .then(ribbon)
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
            w: parseFloat(size[0]),
            h: parseFloat(size[1]),
            d: parseFloat(size[2])
        };
    });
}

function wrap(boxes) {
    return boxes.map(function(box) {
        box.surfaceArea = surfaceArea(box.w, box.h, box.d);
        box.smallestSide = smallestSide(box.w, box.h, box.d);
        box.areaOfWrappingPaperRequired = box.surfaceArea + box.smallestSide;
        return box;
    });
}

function ribbon(boxes) {
    return boxes.map(function(box) {
        box.smallestPerimeter = smallestPerimeter(box.w, box.h, box.d);
        box.volume = volume(box.w, box.h, box.d);
        box.ribbonRequired = box.smallestPerimeter + box.volume;
        return box;
    });
}

function reduce(boxes) {
    var summary = {
        areaOfWrappingPaperRequired: 0,
        ribbonRequired: 0,
        boxes: boxes
    };
    boxes.forEach(function(box) {
        summary.areaOfWrappingPaperRequired += box.areaOfWrappingPaperRequired;
        summary.ribbonRequired += box.ribbonRequired;
    });
    return summary;
}

function surfaceArea(w, h, d) {
    return (2 * w * h) + (2 * w * d) + (2 * h * d);
}

function smallestSide(w, h, d) {
    return Math.min(w * h, w * d, h * d);
}

function smallestPerimeter(w, h, d) {
    return 2 * Math.min(w + h, w + d, h + d);
}

function volume(w, h, d) {
    return w * h * d;
}

function report(summary) {
    console.log('The elves need a total of', summary.areaOfWrappingPaperRequired, 'square feet of wrapping paper, and', summary.ribbonRequired, 'feet of ribbon.');
}

function error(ex) {
    console.log('Error', ex);
}