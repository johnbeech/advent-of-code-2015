var read = require('../lib/read');

read(__dirname + '/input.txt', 'utf8')
    .then(solve)
    .then(report)
    .catch(error);

function solve(input) {
    for (var i = 0; i < 40; i++) {
        input = lookAndSay(input);
    }
    return {
        result: input,
        length: input.length
    };
}

function lookAndSay(input) {
    var look = [input[0]];
    var say = [1];
    var char;
    for (var i = 1; i < input.length; i++) {
        char = input[i];
        if (last(look) === char) {
            last(say, last(say) + 1);
        } else {
            look.push(char);
            say.push(1);
        }
    }

    var digits = '';
    for (var j = 0; j < look.length; j++) {
        digits = digits + say[j] + look[j];
    }

    return digits;
}

function last(array, value) {
    if (value) {
        array[array.length - 1] = value;
    }
    return array[array.length - 1];
}

function report(summary) {
    console.log('Summary:', summary);
}

function error(ex) {
    console.log('Error:', ex);
    console.log(ex.stack);
}