var read = require('../lib/read');

const modifiers = {
    '^': moveNorth,
    '>': moveEast,
    '<': moveWest,
    'v': moveSouth
};

console.log('Day 3');
read(__dirname + '/input.txt', 'utf8')
    .then(solveYear1)
    .then(report)
    .catch(error);

read(__dirname + '/input.txt', 'utf8')
    .then(solveYear2)
    .then(report)
    .catch(error);

function solve(instructions) {
    return process(instructions, modifiers);
}

function solveYear1(instructions) {
    var state = solve(instructions);
    state.numberOfHousesDeliveredTo = countHousesWithPresents(state);
    state.title = 'Year 1, Santa and the eggnogged elf';
    return state;
}

function solveYear2(instructions) {
    var state = divideSequence(instructions)
        .then(function(instructions) {
            return Promise.all([
                solve(instructions[0]),
                solve(instructions[1])
            ]);
        })
        .then(combine)
        .then(function(state) {
            state.title = 'Year 2, Santa, Robo-Santa, and the eggnogged elf';
            return state;
        });
    return state;
}

function report(summary) {
    console.log(summary.title);
    console.log('Number of houses delivered to', summary.numberOfHousesDeliveredTo);
    console.log('Final position', summary.position);
    console.log();
}

function error(ex) {
    console.log('Error', ex, ex.stack);
}

function divideSequence(instructions) {
    var one = [];
    var two = [];
    for (var i = 0; i < instructions.length; i++) {
        var instruction = instructions[i];
        if (i % 2 == 1) {
            one.push(instruction);
        } else {
            two.push(instruction);
        }
    }
    var sequences = [one.join(''), two.join('')];
    return Promise.accept(sequences);
}

function countHousesWithPresents(state) {
    return Object.keys(state.houses).length;
}

function combine(states) {
    var combinedState = {};
    combinedState.houses = {};
    states.map(function(state) {
        Object.keys(state.houses).map(function(coordinate) {
            combinedState.houses[coordinate] = (combinedState.houses[coordinate] || 0) + state.houses[coordinate];
        });
    });
    combinedState.numberOfHousesDeliveredTo = countHousesWithPresents(combinedState);
    combinedState.position = {
        'santa': states[0].position,
        'robo-santa': states[1].position
    };
    return combinedState;
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