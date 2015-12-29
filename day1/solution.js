var read = require('../lib/read');

const modifiers = {
    '(': moveUp,
    ')': moveDown
};

console.log('Day 1');
read(__dirname + '/input.txt', 'utf8')
    .then(solve)
    .catch(error);

function solve(input) {
    var i = 0;
    var state = initialState();
    var char, modifier;
    var firstEnteredBasementAt = false;
    while (i < input.length) {
        char = input[i];
        modifier = modifiers[char] || syntaxError(char, i);
        state = modifier(state);
        i++;
        firstEnteredBasementAt = firstEnteredBasementAt || checkForBasement(state, i);
    }
    console.log('Ups', state.up);
    console.log('Downs', state.down);
    console.log('Final floor', state.floor);
    console.log('First entered basement at', firstEnteredBasementAt);
}

function checkForBasement(state, position) {
    return (state.floor < 0) ? position : false;
}

function error(ex) {
    console.log('Error', ex);
}

function initialState() {
    return {
        floor: 0,
        up: 0,
        down: 0
    };
}

function moveUp(state) {
    return {
        floor: state.floor + 1,
        up: state.up + 1,
        down: state.down
    };
}

function moveDown(state) {
    return {
        floor: state.floor - 1,
        up: state.up,
        down: state.down + 1
    };
}

function syntaxError(char, i) {
    throw 'Unexpected token ' + char + ' in input string at ' + i;
}