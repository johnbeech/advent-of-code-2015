var read = require('../lib/read');
var write = require('../lib/write');

var MAX_INT = 65535;

var operators = {
    AND: operatorAND,
    OR: operatorOR,
    RSHIFT: operatorRSHIFT,
    LSHIFT: operatorLSHIFT
};

var report = [];
console.report = function() {
    var args = Array.prototype.slice.call(arguments);
    //console.log(args.join(' '));
    report.push(args.join(' '));
};

console.log('Day 7');

read(__dirname + '/input.txt', 'utf8')
    .then(solve)
    .catch(error);

function solve(input, test) {
    return split(input)
        .then(parse)
        .then(processWiringInstructions)
        .then(execute)
        .then(rewire)
        .then(execute)
        .then(writeReport)
        .then(end);
}

function split(input) {
    var lines = input.replace(/\r/g, '').split('\n');
    return Promise.accept(lines);
}

function parse(lines) {
    var instructionMatcher = /(NOT)? ?([a-z\d]+) (AND|OR|RSHIFT|LSHIFT)? ?([a-z\d]+)? ?-> ([a-z]+)/;
    return lines.map(function(string) {
        var instruction = string.match(instructionMatcher);
        var negateInput = instruction[1] ? true : false;
        var input = instruction[2];
        var operation = (instruction[3]) ? {
            operator: instruction[3],
            value: instruction[4]
        } : false;

        var target = instruction[5];
        return {
            negateInput, input, operation, target, string
        };
    });
}

function processWiringInstructions(instructions) {
    var state = initialState();
    console.log('Number of instructions', instructions.length);
    instructions.forEach(function(instruction) {
        applyWiringInstruction(instruction, state);
    });
    return state;
}

function applyWiringInstruction(instruction, state) {

    var result = (instruction.operation) ? function() {
        var wiringValue = state.signals[instruction.target] || resolveOperation(instruction.input, instruction.operation, state)
        console.report('', 'Wiring signal recorded', instruction.string, 'set to', wiringValue);
        return state.signals[instruction.target] = wiringValue;
    } : function() {
        var inputValue = state.signals[instruction.target] || resolveInput(instruction, state);
        console.report('', 'Input signal recorded', instruction.string, 'set to', inputValue);
        return state.signals[instruction.target] = inputValue;
    };

    state.wires[instruction.target] = result;
    console.report('Connected', instruction.target, 'using', instruction.string);
}

function resolveInput(instruction, state) {
    console.report('', 'Resolving input', instruction.input);
    var value = resolveValue(instruction.input, state.wires);
    return (instruction.negateInput) ? (MAX_INT - value) % MAX_INT : value;
}

function resolveValue(input, wires) {
    var result = (isNaN(input)) ? wires[input] : function() {
        console.report('  ', 'Parsed integer', input);
        return parseInt(input);
    };
    return result();
}

function resolveOperation(inputValue, operation, state) {
    var operator = operators[operation.operator] || () => 0;
    console.report('', 'Resolving', inputValue, operation.operator, operation.value);
    return operator(inputValue, operation.value, state.wires);
}

function operatorAND(a, b, wires) {
    var av = resolveValue(a, wires);
    var bv = resolveValue(b, wires);
    var result = av & bv;
    console.report(' ', a, 'AND', b);
    console.report(' ', av, 'AND', bv, ':', result);
    return result;
}

function operatorOR(a, b, wires) {
    var av = resolveValue(a, wires);
    var bv = resolveValue(b, wires);
    var result = av | bv;
    console.report(' ', a, 'OR', b);
    console.report(' ', av, 'OR', bv, ':', result);
    return result;
}

function operatorLSHIFT(a, b, wires) {
    var av = resolveValue(a, wires);
    var bv = resolveValue(b, wires);
    var result = av << bv;
    console.report(' ', a, '<<', b);
    console.report(' ', av, '<<', bv, ':', result);
    return result;
}

function operatorRSHIFT(a, b, wires) {
    var av = resolveValue(a, wires);
    var bv = resolveValue(b, wires);
    var result = av >> bv;
    console.report(' ', a, '>>', b);
    console.report(' ', av, '>>', bv, ':', result);
    return result;
}

function initialState() {
    return {
        wires: {},
        signals: {}
    };
}

function execute(state) {
    Object.keys(state.wires).forEach(function(key) {
        console.report('Solving for', key);
        state.signals[key] = resolveValue(key, state.wires);
    });

    return state;
}

function rewire(state) {
    console.report('Rewiring a', state.signals.a, 'on to b', state.signals.b);
    var val = state.signals.a;
    state.wires.b = function() {
        return val;
    };
    deleteKeys(state.signals);
    return state;
}

function deleteKeys(value) {
    Object.keys(value).forEach(function(key) {
        delete value[key];
    });
}

function writeReport(state) {

    var outputFile = 'day7.json';
    console.log('Writing report to', outputFile);

    return write(outputFile, JSON.stringify({
        'Report': report,
        'Final state': state.signals
    }, null, '  ')).then(function() {
        console.log('Report written to', outputFile);
        return {
            'Signals': state.signals
        };
    });
}

function end(summary) {
    console.log('Summary', JSON.stringify(summary, null, '  '));
}

function error(ex) {
    console.log('Error', ex, ex.stack);
}