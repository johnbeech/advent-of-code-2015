var read = require('../lib/read');

const modifiers = {
    '^': moveNorth,
    '>': moveEast,
    '<': moveWest,
    'v': moveSouth
};

console.log('Day 3');
read(__dirname + '/input.txt', 'utf8')
    .then(solve)
    .then(report)
    .catch(error);

function solve(input) {
    var state = process(input, modifiers);
    state.numberOfHousesDeliveredTo = Object.keys(state.houses).length;
    return state;
}

function report(summary) {
    console.log('Number of houses delivered to', summary.numberOfHousesDeliveredTo);
    console.log('Final position', summary.position.x, ',', summary.position.y)
}

function error(ex) {
    console.log('Error', ex, ex.stack);
}

function process(input, actions) {
    var i = 0;
    var state = initialState();
    var firstEnteredBasementAt = false;
    var char, modifier;
    while (i < input.length) {
        char = input[i];
        modifier = modifiers[char] || syntaxError(char, i);
        state = modifier(state);
        i++;
    }
    return state;
}

function initialState() {
    return {
        houses: {
            '0:0': 1
        },
        position: {
            x: 0,
            y: 0
        }
    };
}

function moveNorth(state) {
    state.position.y += 1;
    return deliverPresentAtCurrentLocation(state);
}

function moveSouth(state) {
    state.position.y -= 1;
    return deliverPresentAtCurrentLocation(state);
}

function moveEast(state) {
    state.position.x += 1;
    return deliverPresentAtCurrentLocation(state);
}

function moveWest(state) {
    state.position.x -= 1;
    return deliverPresentAtCurrentLocation(state);
}

function deliverPresentAtCurrentLocation(state) {
    var x = state.position.x;
    var y = state.position.y;
    var presents = state.houses[`${x}:${y}`] || 0;
    state.houses[`${x}:${y}`] = presents + 1;
    return state;
}

function syntaxError(char, i) {
    throw 'Unexpected token ' + char + ' in input string at ' + i;
}